import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListModule } from 'src/list';
import { AIListBuilderComponent } from './list-builder.component';
import { ButtonModule, IconModule } from 'carbon-components-angular';

export { EditingStyle } from './list-builder-types';

@NgModule({
  declarations: [AIListBuilderComponent],
  exports: [AIListBuilderComponent],
  imports: [ButtonModule, CommonModule, ListModule, IconModule],
})
export class ListBuilderModule {}
