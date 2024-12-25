import { RowOrColumn } from "../../poms/form";

export const ROW_COL: RowOrColumn[] = [
    { type: 'row', placeHolder: 'Row 1', fill: 'Friendliness' },
    { type: 'row', placeHolder: 'Row 2', fill: 'Knowledge' },
    { type: 'row', button: 'Add row', placeHolder: 'input-option-2', fill: 'Quickness' },
  
    { type: 'column', placeHolder: 'Column 1', fill: 'Excellent' },
    { type: 'column', placeHolder: 'Column 2', fill: 'Very good' },
    { type: 'column', button: 'Add column', placeHolder: 'Column 3', fill: 'Average' }
  ];