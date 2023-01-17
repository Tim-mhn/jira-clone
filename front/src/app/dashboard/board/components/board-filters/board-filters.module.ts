import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimSelectModule } from '@tim-mhn/ng-forms/select';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { BoardFiltersComponent } from './board-filters.component';
import { MemberComponentsModule } from '../../../../shared/components/member/member-components.module';

@NgModule({
  declarations: [BoardFiltersComponent],
  imports: [
    CommonModule,
    TimSelectModule,
    TimUIButtonModule,
    TypedFormsModule,
    ReactiveFormsModule,
    MemberComponentsModule,
  ],
  exports: [BoardFiltersComponent],
})
export class BoardFiltersModule {}
