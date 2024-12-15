import { NextApiResponseServerTo } from "@/lib/types";
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerTo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });

    io.on("connection", (s) => {
      s.on("create-room", (fileId) => {
        console.log('room-created')
        s.join(fileId);
      });
      s.on("send-changes", (deltas, fileId) => {
        console.log('send')
        s.to(fileId).emit("receive-changes", deltas, fileId);
      });
      s.on("send-cursor-move", (range, fileId, cursorId) => {
        console.log('send-cursor-change')
        s.to(fileId).emit("receive-cursor-move", range, fileId, cursorId);
      });
    });
    res.socket.server.io=io;
  }
  res.end();
};


export default ioHandler;