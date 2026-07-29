"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDraftByUser = findDraftByUser;
exports.upsertDraft = upsertDraft;
exports.deleteDraft = deleteDraft;
exports.publishDraft = publishDraft;
const database_1 = __importDefault(require("../config/database"));
async function findDraftByUser(userId) {
    const draft = await database_1.default.listingDraft.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
    });
    if (!draft)
        return null;
    return {
        ...draft,
        price: draft.price ? Number(draft.price) : null,
        formData: draft.formData || {},
    };
}
async function upsertDraft(userId, data) {
    const activeDraft = await findDraftByUser(userId);
    const draftId = activeDraft?.id;
    const prismaData = {
        currentStep: data.currentStep,
        formData: data.formData !== undefined ? data.formData : activeDraft?.formData,
    };
    const record = await database_1.default.listingDraft.upsert({
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
async function deleteDraft(id) {
    return database_1.default.listingDraft.delete({ where: { id } });
}
async function publishDraft(userId) {
    const activeDraft = await findDraftByUser(userId);
    if (!activeDraft)
        throw new Error('No active draft found');
    const formData = activeDraft.formData || {};
    // Safe parsing based on expected Step 1-5 format
    const price = formData.expectedPrice ? BigInt(Math.round(formData.expectedPrice)) : BigInt(0);
    const area = formData.superBuiltUpArea ? parseInt(formData.superBuiltUpArea) : (formData.builtUpArea ? parseInt(formData.builtUpArea) : 0);
    const listingType = (formData.listingPurpose === 'rent' || formData.listingPurpose === 'lease' ? 'rent' : 'sell');
    const propertyType = formData.propertyCategory || formData.propertyType || 'apartment';
    // Prepare media and documents arrays for nested creation
    const listingMedia = [];
    const listingDocuments = [];
    // Images
    if (Array.isArray(formData.images)) {
        formData.images.forEach((img, idx) => {
            listingMedia.push({ mediaType: 'image', url: img, isPrimary: idx === 0 });
        });
    }
    // Videos
    if (Array.isArray(formData.videos)) {
        formData.videos.forEach((vid) => {
            listingMedia.push({ mediaType: 'video', url: vid, isPrimary: false });
        });
    }
    // Floor Plans
    if (formData.floorPlan) {
        listingMedia.push({ mediaType: 'floor_plan', url: formData.floorPlan, isPrimary: false });
    }
    if (Array.isArray(formData.floorPlans)) {
        formData.floorPlans.forEach((fp) => {
            listingMedia.push({ mediaType: 'floor_plan', url: fp, isPrimary: false });
        });
    }
    // Virtual Tour
    if (formData.virtualTourUrl) {
        listingMedia.push({ mediaType: 'virtual_tour', url: formData.virtualTourUrl, isPrimary: false });
    }
    // Documents
    if (Array.isArray(formData.documents)) {
        formData.documents.forEach((doc) => {
            if (typeof doc === 'string') {
                listingDocuments.push({ documentType: 'other', url: doc });
            }
            else if (doc && doc.url) {
                listingDocuments.push({ documentType: doc.type || 'other', url: doc.url });
            }
        });
    }
    // Create Listing
    const listing = await database_1.default.listing.create({
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
    await database_1.default.listingDraft.delete({ where: { id: activeDraft.id } });
    return {
        ...listing,
        price: Number(listing.price),
    };
}
//# sourceMappingURL=listingDraft.repository.js.map