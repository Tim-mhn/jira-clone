import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberIconModule } from './member-icon/member-icon.module';
import { MemberIconComponent } from './member-icon/member-icon.component';
import { MemberInfoComponent } from './member-info/member-info.component';

@NgModule({
  declarations: [MemberInfoComponent],
  imports: [CommonModule, MemberIconModule],
  exports: [MemberIconComponent, MemberInfoComponent],
})
export class MemberComponentsModule {}
