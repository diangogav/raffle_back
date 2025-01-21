import { Template } from "../../../shared/email/domain/Template";

type RaffleDrawnTemplateParams = {
	winnerTicketNumber: string;
	raffleTitle: string;
	raffleCover: string;
};

export class RaffleDrawnTemplate extends Template {
	public readonly subject: string;

	constructor(private readonly data: RaffleDrawnTemplateParams) {
		super();
		this.subject = `🎉 ¡Ya tenemos un ganador para "${this.data.raffleTitle}"!`;
	}

	value(): string {
		return `
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="preconnect" href="https://fonts.googleapis.com">
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
				<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
				<title>Document</title>
			</head>
			<body style="margin: 0; padding: 0;  font-family: 'Public Sans', sans-serif;">
				<div style='margin:0; text-align:center;
			  background: #F1F5F9;
			  padding: 40px;
			  align-items: center;
			 '>
			  <div style='margin:0 0; padding: 0px;'><img width=180 src="https://res.cloudinary.com/teamsito/image/upload/v1736189970/xrr6n3ikg4ab7xl6x9a9.png" alt=""></div>
			  <div style='margin:32px 0; padding: 0px;'>
				<h1 style=' color: #070A13;
			text-align: center;
			font-size: 40px;
			font-style: normal;
			font-weight: 500;
			line-height: 30px;margin:0; padding: 0px;'>🎊 Tenemos un Ganador 🎊</h1>
			  </div>
			  <div style='  background: white;  margin:32px 0; padding: 44px 24px;
			'>
				<div style='margin:0; padding: 0px;'><img width="300"
					 style='margin:0; padding: 0px;' src=${this.data.raffleCover} alt="img"></div>
				<div>
				  <div style='margin:0; padding: 0px;'>
					<p style='margin-bottom:45px'>El numero ganador es el</p>
					<p style='margin:20px 0; padding: 0px;  color: #070A13;
			text-align: center;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px;'><strong style='font-size:62px; color:#f07151'>${this.data.winnerTicketNumber} 🎉</strong></p>
			 
					<p style='margin:30px 0; padding: 0px;  color: #070A13;
			text-align: center;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px;'><p>El equipo de Raffle felicita al ganador y a todos los participantes por participar.</p></p>
				  <p style='margin:30px 0; padding: 0px;  color: #070A13;
			text-align: center;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px;'><p>Los esperamos en los proximos sorteos</p></p>
					<p style='margin:30px 0; padding: 0px;  color: #070A13;
			text-align: center;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 20px;'><b>¡Gracias por elegir Raffle!</b> </p>
				  </div>
				</div>
			  <div style=' margin:10px auto; position:relative; width:100%;'>
			</div>
			  </div>
			  <div>
				<a href="https://raffleofficial.com/" target="_blank" style='margin:0; padding: 0px;  color: #475569;
			text-align: center;
			font-size: 12px;
			font-style: normal;
			font-weight: 500;
			line-height: 18px;
			text-decoration-line: underline;
			text-decoration-style: solid;
			text-decoration-skip-ink: none;
			text-decoration-thickness: auto;
			text-underline-offset: auto;
			text-underline-position: from-font;'>www.raffleofficial.com</a>
			  </div>
			</div>
			</body>
			</html>
    `;
	}
}
