"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveDraft = getActiveDraft;
exports.saveDraftStep = saveDraftStep;
exports.publishDraft = publishDraft;
const draftRepo = __importStar(require("../repositories/listingDraft.repository"));
const response_1 = require("../utils/response");
/** GET /api/v1/listings/draft — fetch active user draft */
async function getActiveDraft(req, res, next) {
    try {
        const { userId } = req.user;
        const draft = await draftRepo.findDraftByUser(userId);
        if (!draft) {
            (0, response_1.sendSuccess)(res, null, 'No active listing draft found');
            return;
        }
        (0, response_1.sendSuccess)(res, { draft }, 'Active listing draft retrieved');
    }
    catch (err) {
        next(err);
    }
}
/** POST /api/v1/listings/draft — save step progress in draft */
async function saveDraftStep(req, res, next) {
    try {
        const { userId } = req.user;
        const draft = await draftRepo.upsertDraft(userId, req.body);
        (0, response_1.sendCreated)(res, { draft }, 'Listing draft progress saved');
    }
    catch (err) {
        next(err);
    }
}
async function publishDraft(req, res, next) {
    try {
        const { userId } = req.user;
        const listing = await draftRepo.publishDraft(userId);
        (0, response_1.sendCreated)(res, { listing }, 'Listing published successfully');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=listingDraft.controller.js.map