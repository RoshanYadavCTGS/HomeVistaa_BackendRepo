"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const createPrismaClient = () => {
    return new client_1.PrismaClient({
        log: env_1.env.isDev
            ? ['query', 'info', 'warn', 'error']
            : ['warn', 'error'],
        errorFormat: env_1.env.isDev ? 'pretty' : 'minimal',
    });
};
exports.prisma = global.__prisma ?? createPrismaClient();
if (env_1.env.isDev) {
    global.__prisma = exports.prisma;
}
async function connectDatabase() {
    await exports.prisma.$connect();
    console.log('✅ Database connected successfully');
}
async function disconnectDatabase() {
    await exports.prisma.$disconnect();
    console.log('🔌 Database disconnected');
}
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map