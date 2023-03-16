// import type { CMSFilters } from '../../types/CMSFilters';
// import type { Product } from './types';

/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  async (filtersInstances) => {
    // Get the filters instance
    const [filtersInstance] = filtersInstances;

    // Get the list instance
    const { listInstance } = filtersInstance;

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const oppTemplateElement = firstItem.element;

    // Fetch external data
    const opportunities = await fetchOpportunities();
    console.log('opportunities are from local ', opportunities);

    // Remove existing items
    listInstance.clearItems();

    // Create the new items
    const newOpportunities = opportunities.map((eachOpp) => createItem(eachOpp, oppTemplateElement));

    // Populate the list
    await listInstance.addItems(newOpportunities);

    // Move fields into their field categories
    moveFields();

    // TODO Insert the locations

    // Sync the CMSFilters instance with the new created filters
    filtersInstance.storeFiltersData();
  },
]);

/**
 * Fetches opportunities from airtable
 * @returns An array of {@link opportunities}.
 */

const fetchOpportunities = async () => {
  try {
    const response = await fetch('https://discover-plus-server.herokuapp.com/api/v1/opportunities');
    const data = await response.json();
    return data.allOpportunities;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Creates an item from the template element.
 * @param opportunity The opportunity data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (eachOpp, templateElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true);

  // Query inner elements
  const itemWrap = newItem.querySelector('[discover-element="item-wrap"]');
  const image = newItem.querySelector('[discover-element="item-image"]');
  const fieldCategory = newItem.querySelector('[discover-element="item-field-category"]');
  const name = newItem.querySelector('[discover-element="item-name"]');
  const locationType = newItem.querySelector('[discover-element="location-type"]');
  const amountValues = newItem.querySelector('[discover-element="amount-values"]');
  const gradeValues = newItem.querySelector('[discover-element="grade-values"]');

  // CMS filters values start here
  const typeFilter = newItem.querySelector('[fs-cmsfilter-field="type"]');
  const fieldCategoryFilter = newItem.querySelector('[fs-cmsfilter-field="field-category"]');
  const fieldFilter = newItem.querySelector('[fs-cmsfilter-field="field"]');
  const ageFilter = newItem.querySelector('[fs-cmsfilter-field="age"]');
  const gradeFilter = newItem.querySelector('[fs-cmsfilter-field="grade"]');
  const timetableFilter = newItem.querySelector('[fs-cmsfilter-field="timetable"]');
  const locationTypeFilter = newItem.querySelector('[fs-cmsfilter-field="location-type"]');
  const locationCategoryFilter = newItem.querySelector('[fs-cmsfilter-field="location-category"]');
  const locationFilter = newItem.querySelector('[fs-cmsfilter-field="location"]');
  const deadlineFilter = newItem.querySelector('[fs-cmsfilter-field="deadline"]');
  const costFilter = newItem.querySelector('[fs-cmsfilter-field="cost"]');
  const financialAidFilter = newItem.querySelector('[fs-cmsfilter-field="financial-aid"]');

  // const image = newItem.querySelector('[data-element="image"]');
  // const category = newItem.querySelector('[data-element="category"]');
  // const description = newItem.querySelector('[data-element="description"]');

  // Populate inner elements
  // Setting the URL for the template page
  itemWrap.href = `opportunity/${eachOpp.slug}`;

  if (image && eachOpp.organizationImageUrl) {
    image.src = eachOpp.organizationImageUrl;
    image.classList.remove('w-dyn-bind-empty');
    image.parentElement.classList.remove('w-condition-invisible');
  }
  if (name) {
    name.textContent = eachOpp.name;
  }
  if (fieldCategory && eachOpp.fieldCategories) {
    eachOpp.fieldCategories.split(',').forEach((eachFieldCategory) => {
      const newFieldCategory = fieldCategory.cloneNode(true);
      newFieldCategory.textContent = eachFieldCategory.trim();

      fieldCategory.parentElement.append(newFieldCategory);
    });
    // Hide the type template
    fieldCategory.style.display = 'none';
  } else if (fieldCategory) {
    fieldCategory.parentElement.style.display = 'none';
  }

  if (locationType && eachOpp.remoteInperson) {
    locationType.textContent = eachOpp.remoteInperson;
  } else if (locationType) {
    locationType.parentElement.style.display = 'none';
  }
  if (amountValues && eachOpp.amount) {
    amountValues.textContent = eachOpp.amount;
  } else if (amountValues) {
    amountValues.parentElement.style.display = 'none';
  }

  if (gradeValues && eachOpp.gradeLevelValues) {
    gradeValues.textContent = eachOpp.gradeLevelValues;
  } else if (gradeValues) {
    gradeValues.parentElement.style.display = 'none';
  }

  if (typeFilter && eachOpp.types) {
    eachOpp.types.forEach((eachType) => {
      const newType = typeFilter.cloneNode(true);
      newType.textContent = eachType;

      typeFilter.parentElement.append(newType);
    });
    typeFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (fieldCategoryFilter && eachOpp.fieldCategories) {
    eachOpp.fieldCategories.split(',').forEach((eachFieldCategory) => {
      const newFieldCategory = fieldCategoryFilter.cloneNode(true);
      newFieldCategory.textContent = eachFieldCategory.trim();

      fieldCategoryFilter.parentElement.append(newFieldCategory);
    });
    fieldCategoryFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (fieldFilter && eachOpp.fields) {
    eachOpp.fields.forEach((eachField) => {
      const newField = fieldFilter.cloneNode(true);
      newField.textContent = eachField;
      fieldFilter.parentElement.append(newField);
    });

    fieldFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (ageFilter && eachOpp.ageValues) {
    eachOpp.ageValues.split(',').forEach((eachAge) => {
      const newAge = ageFilter.cloneNode(true);
      newAge.textContent = eachAge.trim();
      ageFilter.parentElement.append(newAge);
    });
    ageFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (gradeFilter && eachOpp.gradeLevelValues) {
    eachOpp.gradeLevelValues.split(',').forEach((eachGrade) => {
      const newGrade = gradeFilter.cloneNode(true);

      if (eachGrade.trim() === 'Elementary School') {
        newGrade.textContent = -1;
      } else if (eachGrade.trim() === 'Middle School') {
        newGrade.textContent = 0;
      } else if (eachGrade.trim() === 'High School') {
        newGrade.textContent = 1;
      } else if (eachGrade.trim() === 'Undergraduate') {
        newGrade.textContent = 13;
      } else if (eachGrade.trim() === 'Graduate') {
        newGrade.textContent = 14;
      } else if (eachGrade.trim() === 'Post-Graduate') {
        newGrade.textContent = 15;
      } else {
        newGrade.textContent = parseInt(eachGrade.trim().replace(/\D/g, ''));
      }

      gradeFilter.parentElement.append(newGrade);
    });
    gradeFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (timetableFilter && eachOpp.timetable) {
    eachOpp.timetable.split(',').forEach((eachTimetable) => {
      const newTimetable = timetableFilter.cloneNode(true);
      newTimetable.textContent = eachTimetable.trim();
      timetableFilter.parentElement.append(newTimetable);
    });
    timetableFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (locationTypeFilter && eachOpp.remoteInperson) {
    if (eachOpp.remoteInperson === 'Remote & In-person') {
      const newLocationType = locationTypeFilter.cloneNode(true);
      newLocationType.textContent = 'Remote';
      locationTypeFilter.parentElement.append(newLocationType);
      locationTypeFilter.textContent = 'In-person';
    } else {
      locationTypeFilter.textContent = eachOpp.remoteInperson;
    }
    // locationTypeFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (locationCategoryFilter && eachOpp.locationCategory) {
    eachOpp.locationCategory.forEach((eachLocationCategory) => {
      const newLocationCategory = locationCategoryFilter.cloneNode(true);
      newLocationCategory.textContent = eachLocationCategory;
      locationCategoryFilter.parentElement.append(newLocationCategory);
    });
    locationCategoryFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (locationFilter && eachOpp.location) {
    eachOpp.location.split(',').forEach((eachLocation) => {
      const newLocation = locationFilter.cloneNode(true);
      newLocation.textContent = eachLocation.trim();
      locationFilter.parentElement.append(newLocation);
    });
    locationFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (deadlineFilter && eachOpp.applicationDeadline) {
    eachOpp.applicationDeadline.split(',').forEach((eachDeadline) => {
      const newDeadline = deadlineFilter.cloneNode(true);
      newDeadline.textContent = eachDeadline.trim();
      deadlineFilter.parentElement.append(newDeadline);
    });
    deadlineFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (costFilter && eachOpp.amount) {
    eachOpp.amount.split(',').forEach((eachAmount) => {
      const newAmount = costFilter.cloneNode(true);
      newAmount.textContent = eachAmount.trim();
      costFilter.parentElement.append(newAmount);
    });
    costFilter.removeAttribute('fs-cmsfilter-field');
  }

  if (financialAidFilter) financialAidFilter.textContent = eachOpp.financialAid ? 'Financial Aid' : '';
  // if (category) category.textContent = eachOpp.category;
  // if (description) description.textContent = eachOpp.description;

  return newItem;
};

/**
 * Moving the fields into their field categories
 */

const moveFields = () => {
  const fields = document.querySelectorAll('[discover-element="field-wrap"]');
  const fieldCategories = document.querySelectorAll('[discover-element="field-category-wrap"]');

  fieldCategories.forEach((eachFieldCategory) => {
    fields.forEach((eachField) => {
      if (
        eachFieldCategory.querySelector('.home_filters_checkbox-label').innerHTML ===
        eachField.querySelector('.home_filters_field-category').innerHTML
      ) {
        eachFieldCategory.querySelector('.home_filters_field-wrap').append(eachField);
      }
    });
  });

  console.log({ fields, fieldCategories });
};
