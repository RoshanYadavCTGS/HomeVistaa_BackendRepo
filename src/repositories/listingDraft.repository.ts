import prisma from '../config/database';

export interface ListingDraftInput {
  currentStep: number;
  formData?: any;
}

export async function findDraftByUser(userId: string) {
  const draft = await prisma.listingDraft.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  if (!draft) return null;
  return {
    ...draft,
    price: draft.price ? Number(draft.price) : null,
    formData: draft.formData || {},
  };
}

export async function upsertDraft(userId: string, data: ListingDraftInput) {
  const activeDraft = await findDraftByUser(userId);
  const draftId = activeDraft?.id;

  const prismaData: any = {
    currentStep: data.currentStep,
    formData: data.formData !== undefined ? data.formData : activeDraft?.formData,
  };

  const record = await prisma.listingDraft.upsert({
    where: { id: draftId || 'new-draft-id-placeholder' },
    update: prismaData,
    create: {
      ...prismaData,
      userId,
    },
  });

  return {
    ...record,
    formData: record.formData || {},
  };
}

export async function deleteDraft(id: string) {
  return prisma.listingDraft.delete({ where: { id } });
}

export async function publishDraft(userId: string) {
  const activeDraft = await findDraftByUser(userId);
  if (!activeDraft) throw new Error('No active draft found');

  const formData: any = activeDraft.formData || {};
  
  // Safe parsing based on expected Step 1-5 format
  const price = formData.expectedPrice ? BigInt(Math.round(formData.expectedPrice)) : BigInt(0);
  const area = formData.superBuiltUpArea ? parseInt(formData.superBuiltUpArea) : (formData.builtUpArea ? parseInt(formData.builtUpArea) : 0);
  
  const listingType = (formData.listingPurpose === 'rent' || formData.listingPurpose === 'lease' ? 'rent' : 'sell') as any;
  const propertyType = formData.propertyCategory || formData.propertyType || 'apartment';
  
  // Prepare media and documents arrays for nested creation
  const listingMedia: any[] = [];
  const listingDocuments: any[] = [];

  // Images
  if (Array.isArray(formData.images)) {
    formData.images.forEach((img: string, idx: number) => {
      listingMedia.push({ mediaType: 'image', url: img, isPrimary: idx === 0 });
    });
  }
  // Videos
  if (Array.isArray(formData.videos)) {
    formData.videos.forEach((vid: string) => {
      listingMedia.push({ mediaType: 'video', url: vid, isPrimary: false });
    });
  }
  // Floor Plans
  if (formData.floorPlan) {
    listingMedia.push({ mediaType: 'floor_plan', url: formData.floorPlan, isPrimary: false });
  }
  if (Array.isArray(formData.floorPlans)) {
    formData.floorPlans.forEach((fp: string) => {
      listingMedia.push({ mediaType: 'floor_plan', url: fp, isPrimary: false });
    });
  }
  // Virtual Tour
  if (formData.virtualTourUrl) {
    listingMedia.push({ mediaType: 'virtual_tour', url: formData.virtualTourUrl, isPrimary: false });
  }

  // Documents
  if (Array.isArray(formData.documents)) {
    formData.documents.forEach((doc: any) => {
      if (typeof doc === 'string') {
        listingDocuments.push({ documentType: 'other', url: doc });
      } else if (doc && doc.url) {
        listingDocuments.push({ documentType: doc.type || 'other', url: doc.url });
      }
    });
  }

  // Create Listing
  const listing = await prisma.listing.create({
    data: {
      userId,
      title: formData.propertyTitle || 'Untitled Property',
      type: propertyType,
      listingType,
      role: 'owner', // Defaulting role as owner for simplicity unless specified
      price,
      area,
      locality: formData.locality || '',
      city: formData.city || '',
      address: formData.completeAddress || formData.landmarks || '',
      zipcode: formData.pincode || '',
      beds: formData.bhkConfiguration ? parseInt(formData.bhkConfiguration) : (formData.bedrooms ? parseInt(formData.bedrooms) : null),
      baths: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      possessionStatus: formData.possessionStatus === 'Under Construction' ? 'under_construction' : 'ready',
      possessionDate: formData.availableFrom || null,
      reraId: formData.reraNumber || null,
      ownerName: formData.ownerName || 'Owner',
      ownerPhone: formData.ownerPhone || '',
      status: 'pending',
      
      // Store extended data in JSON fields for backup
      amenities: formData.amenities || [],
      media: {
        images: formData.images || [],
        videos: formData.videos || [],
        floorPlan: formData.floorPlan || null,
        virtualTourUrl: formData.virtualTourUrl || null,
      },
      details: formData, // the entire form payload as a backup/reference
      seo: {
        title: formData.seoTitle || '',
        description: formData.seoDescription || '',
      },
      
      // Create related records
      listingMedia: {
        create: listingMedia
      },
      listingDocuments: {
        create: listingDocuments
      }
    }
  });

  // Delete the draft
  await prisma.listingDraft.delete({ where: { id: activeDraft.id } });

  return {
    ...listing,
    price: Number(listing.price),
  };
}


