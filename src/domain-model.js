import { observable } from 'mobx';
import { createViewModel } from 'mobx-utils';
import { serialize as doSerialize } from 'serializr';

export default class DomainModel {
  isReloading = observable.box(false);
  isError = observable.box(false);
  isSaving = observable.box(false);

  get viewModel() {
    if (!this.reusedViewModel) {
      this.reusedViewModel = createViewModel(this);
      return this.reusedViewModel;
    }

    return this.reusedViewModel;
  }

  serialize() {
    return doSerialize(this);
  }
}
