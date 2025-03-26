import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';




@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server 

  constructor(private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService, // para validar el token
   
    
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authetincation as string; 
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token) 
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect()
      return
    }


   
   
    this.wss.emit('clients-updated', this.messageWsService.getConnecteClients()) 
    
  }
  handleDisconnect(client: Socket) {
   
   this.messageWsService.removeClient(client.id)
   this.wss.emit('clients-updated', this.messageWsService.getConnecteClients()) 

  }

 

  @SubscribeMessage('message-from-client')
  handleMessage(client: Socket, payload: NewMessageDto) {
    this.wss.emit('message-to-client', payload) 
  
    //message-from-server / esto emite un mensaje al cliente que lo envio
   /*  client.emit('message-from-server',{ //manda el mensaje al cliente que lo envio
      fullName: "soy yo",
      message: payload.message || 'no message'
    })  */
     
      // Emitir a todos menos al cliente que lo envio
       /* client.broadcast.emit('message-from-server',{ 
        fullName: "soy yo",
        message: payload.message || 'no message'
      })  */

    // Emitir a todos y al cliente que lo envio
    this.wss.emit('message-from-server',{
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no message'
    })

  }


}
