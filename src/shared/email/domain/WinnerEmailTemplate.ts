import { Template } from "./Template";

type PaymentApprovedTemplateParams = {
	drawName: string;
	drawNumber: number;
	drawPrice: number;
	winnerName: string;
	totalParticipants: number;
	winnerNumber: string;
};
export class WinnerEmailTemplate extends Template {
	public readonly subject: string;

	constructor(private readonly data: PaymentApprovedTemplateParams) {
		super();
		this.subject = "¡Felicitaciones! 🎉";
	}

	value(): string {
		return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
</head>
<body bgcolor="#f5f5f5" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
   
    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
             
                <table border="0" width="600" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 20px; border-radius: 8px;">
                         
                            <table border="0" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px; border-bottom: 2px solid #ffd700;">
                                        <img src="https://res.cloudinary.com/teamsito/image/upload/v1736189970/xrr6n3ikg4ab7xl6x9a9.png" alt="Logo de Raffle" style="max-width: 200px; height: auto;" />
                                    </td>
                                </tr>
                            </table>

                         
                            <table border="0" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <h1 style="color: #333333; font-family: Arial, sans-serif; font-size: 24px; margin-bottom: 15px;">¡Felicitaciones! 🎉</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#fff9e6" style="padding: 15px; border-radius: 5px;">
                                        <h3 style="color: #333333; font-family: Arial, sans-serif; margin-top: 0;">Tus Detalles de Ganador:</h3>
                                        <p style="color: #666666; font-family: Arial, sans-serif;">Número de Sorteo: ${this.data.drawNumber} </p>
                                        <p style="color: #666666; font-family: Arial, sans-serif;">Premio: ${this.data.drawName}</p>
                                        <p style="color: #666666; font-family: Arial, sans-serif;">Valor: ${this.data.drawPrice}$</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding-top: 20px;">
                                        <p style="color: #333333; font-family: Arial, sans-serif;">Estimado/a ${this.data.winnerName},</p>
                                        <p style="color: #666666; font-family: Arial, sans-serif;">Es un placer informarte que has sido seleccionado como ganador en nuestra rifra número ${this.data.drawNumber}. Tu número ${this.data.winnerNumber} ha sido el elegido entre [TOTAL_PARTICIPANTES] participantes.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td bgcolor="#ffd700" style="border-radius: 25px; padding: 12px 30px;">
                                                    <a href="[URL_CONTACTO]" style="color: black; font-weight: bold; text-decoration: none; display: inline-block;">
                                                        Nuestro equipo de soporte se pondra en contacto con UD.
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 30px;">
                                        <div class="footer">
                                            <div class="social-links">
                                                <a href="https://www.instagram.com/raffle.ve?igsh=YWFqdzVsY3dmeHN4&utm_source=qr">Instagram</a>
                                                <!-- <a href="[TWITTER_URL]">Tiktok</a> -->
                                            </div>
                                            <p>© 2024 Raffle. Todos los derechos reservados.</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
	}
}
