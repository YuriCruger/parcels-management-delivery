import { JwtService } from "@nestjs/jwt";
import { CourierFactory } from "test/factories/make-courier";

export async function makeUserAndAuthenticate(
  jwtService: JwtService,
  courierFactory: CourierFactory,
) {
  const user = await courierFactory.makePrismaCourier();
  const userId = user.id.toString();

  const accessToken = jwtService.sign({ sub: user.id.toString() });
  return { user, accessToken, userId };
}
