import { Pipe, PipeTransform } from '@angular/core';
import { UserResponse } from '../models/user-response';

@Pipe({
  name: 'icon',
  standalone: true,
  pure: false,
})
export class IconPipe implements PipeTransform {
  transform(u: UserResponse): string {
    if (u.isOwner) return 'pi pi-pencil';
    if (u.isFriend) return 'pi pi-user-minus';
    if (u.sentRequest) return 'pi pi-times';
    if (u.receivedRequest) return 'pi pi-check';
    return 'pi pi-user-plus';
  }
}
