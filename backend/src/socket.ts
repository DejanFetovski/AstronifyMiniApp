
import { Server } from "http";
import socket, { Socket } from "socket.io";
// import { autoEarningUsers, calcClickBalance, userInfoList } from "./core/tapgame";
// import { UserModel } from "./models/user.model";

interface CustomSocket extends Socket {
    user?: string;
}

let io: socket.Server | null = null;
let clients: CustomSocket[] = [];

export const startWebSocketServer = (
    server: Server,
    connectDone?: (socket: CustomSocket) => void,
    disconnectDone?: (userId: string) => void
) => {
    // io = new socket.Server(server, {
    //     cors: {
    //         origin: "*",
    //         methods: ["GET", "POST"],
    //     },
    // });

    // io.on("connection", (socket: CustomSocket) => {
    //     socket.on("NEW_USER", async (userId: string) => {
    //         console.log(`Connected websocket! User=${userId}`);
    //         const user = userId
    //         const userInfo = await UserModel.findOne({ chatId: userId });
    //         if (user && userInfo) {
    //             socket.user = user;

    //             userInfoList[user] = userInfo;
    //             let autoEarnInfo = autoEarningUsers.find((_v, _i) => _v.chatId == user);

    //             if (autoEarnInfo) {
    //                 autoEarnInfo.online = true;
    //                 if (autoEarnInfo.scoreOffline > 0)
    //                     socket.emit("AUTOEARN_CLAIM", autoEarnInfo?.scoreOffline.toString())
    //             }

    //             clients = [...clients, socket];
    //             if (connectDone) connectDone(socket);
    //         }
    //     });

    //     socket.on("CROWN_CLICK", async (chatId: string) => {
    //         console.log(`[${chatId}]`, 'crown clicked!');
    //         const res = await calcClickBalance(chatId);
    //         socket.emit("BALANCE_CHANGED", JSON.stringify(res));
    //     })

    //     socket.on("disconnect", () => {
    //         const userId = socket.user;
    //         console.log(`Disconnected websocket! user=${userId}`);
    //         clients = clients.filter((client) => client !== socket);
    //         let autoEarnInfo = autoEarningUsers.find((_v, _i) => _v.chatId == userId);
    //         if (autoEarnInfo) {
    //             autoEarnInfo.online = false;
    //             autoEarnInfo.offlineTimestamp = Date.now();
    //         }
    //         if (disconnectDone && userId) disconnectDone(userId);
    //     });
    // });
};

export const getWebSocketClientList = (): CustomSocket[] => {
    return clients;
};


