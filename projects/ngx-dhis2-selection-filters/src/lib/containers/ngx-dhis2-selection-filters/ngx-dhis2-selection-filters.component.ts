import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import {
  FILTER_ICON,
  ARROW_LEFT_ICON,
  ARROW_RIGHT_ICON,
  DATA_ICON,
  PERIOD_ICON,
  ARROW_DOWN_ICON,
  TREE_ICON
} from '../../icons';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-selection-filters',
  templateUrl: './ngx-dhis2-selection-filters.component.html',
  styleUrls: ['./ngx-dhis2-selection-filters.component.css']
})
export class NgxDhis2SelectionFiltersComponent implements OnInit {
  @Input() dataSelections: any[];
  @Output() filterUpdate: EventEmitter<any[]> = new EventEmitter<any[]>();
  showFilters: boolean;
  showFilterBody: boolean;
  selectedFilter: string;

  // icons
  filterIcon: string;
  arrowLeftIcon: string;
  arrowRightIcon: string;
  arrowDownIcon: string;
  dataIcon: string;
  periodIcon: string;
  orgUnitIcon: string;

  constructor() {
    this.showFilters = this.showFilterBody = false;
    this.selectedFilter = 'DATA';

    // icons initializations
    this.filterIcon = FILTER_ICON;
    this.arrowLeftIcon = ARROW_LEFT_ICON;
    this.arrowRightIcon = ARROW_RIGHT_ICON;
    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.dataIcon = DATA_ICON;
    this.periodIcon = PERIOD_ICON;
    this.orgUnitIcon = TREE_ICON;
  }

  get selectedData(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject ? dataObject.items : [];
  }

  get selectedDataGroups(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject ? dataObject.groups : [];
  }

  get selectedPeriods(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'pe']);
    return dataObject ? dataObject.items : [];
  }

  get selectedOrgUnits(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'ou']);
    return dataObject ? dataObject.items : [];
  }

  ngOnInit() {}

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showFilterBody = true;
    } else {
      this.showFilterBody = false;
    }
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    if (this.selectedFilter === selectedFilter) {
      this.selectedFilter = '';
      this.showFilterBody = false;
    } else {
      this.selectedFilter = selectedFilter;
      this.showFilterBody = true;
    }
  }

  onFilterClose(selectedItems, selectedFilter) {
    if (selectedItems && selectedItems.items.length > 0) {
      this.dataSelections = [
        ...this.updateDataSelectionWithNewSelections(
          this.dataSelections,
          selectedItems
        )
      ];
    }

    if (this.selectedFilter === selectedFilter) {
      this.selectedFilter = '';
      this.showFilterBody = false;
    }
  }

  onFilterUpdate(selectedItems) {
    this.dataSelections = [
      ...this.updateDataSelectionWithNewSelections(
        this.dataSelections,
        selectedItems
      )
    ];
    this.filterUpdate.emit(this.dataSelections);
    this.selectedFilter = '';
    this.showFilterBody = false;
  }

  updateDataSelectionWithNewSelections(
    dataSelections: any[],
    selectedObject: any
  ): any[] {
    const selectedDimension = _.find(dataSelections, [
      'dimension',
      selectedObject.dimension
    ]);
    const selectedDimensionIndex = dataSelections.indexOf(selectedDimension);
    return selectedDimension
      ? [
          ...dataSelections.slice(0, selectedDimensionIndex),
          { ...selectedDimension, ...selectedObject },
          ...dataSelections.slice(selectedDimensionIndex + 1)
        ]
      : dataSelections;
  }
}
