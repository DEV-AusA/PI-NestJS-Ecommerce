import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LoginDataDto } from 'src/auth/dto/auth.login.dto';

@ValidatorConstraint({ name: 'matchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const dto = args.object as LoginDataDto;

    return value === dto.password;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Las contraseñas no coinciden.';
  }
}
