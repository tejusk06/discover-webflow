// import type { CMSFilters } from '../../types/CMSFilters';
// import type { Product } from './types';

/**
 * Fetches fake products from Fake Store API.
 * @returns An array of {@link Product}.
 */

const fetchOpportunities = async () => {
  try {
    const response = await fetch('https://discover-plus-server.herokuapp.com/api/v1/opportunities');
    const data = await response.json();
    return data.allOpportunities;
  } catch (error) {
    console.log('test');
    return [];
  }
};

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
    console.log('opportunities are ', opportunities);

    // Remove existing items
    listInstance.clearItems();

    // Create the new items
    const newOpportunities = opportunities.map((eachOpp) => createItem(eachOpp, oppTemplateElement));

    // Populate the list
    await listInstance.addItems(newOpportunities);

    // Get the template filter
    // const filterTemplateElement = filtersInstance.form.querySelector('[data-element="filter"]');
    // if (!filterTemplateElement) return;

    // Get the parent wrapper
    // const filtersWrapper = filterTemplateElement.parentElement;
    // if (!filtersWrapper) return;

    // Remove the template from the DOM
    // filterTemplateElement.remove();

    // Collect the categories
    // const categories = collectCategories(products);
    // // Create the new filters and append the to the parent wrapper
    // for (const category of categories) {
    //   const newFilter = createFilter(category, filterTemplateElement);
    //   if (!newFilter) continue;
    //   filtersWrapper.append(newFilter);
    // }

    // Sync the CMSFilters instance with the new created filters
    // filtersInstance.storeFiltersData();
  },
]);

/**
 * Creates an item from the template element.
 * @param product The product data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (eachOpp, templateElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true);

  // Query inner elements
  const name = newItem.querySelector('[discover-element="name"]');
  const financialAid = newItem.querySelector('[discover-element="financial-aid"]');
  // const image = newItem.querySelector('[data-element="image"]');
  // const category = newItem.querySelector('[data-element="category"]');
  // const description = newItem.querySelector('[data-element="description"]');

  // Populate inner elements
  if (name) name.textContent = eachOpp.name;
  if (financialAid) financialAid.textContent = eachOpp.financialAid ? 'Financial Aid' : '';
  // if (category) category.textContent = eachOpp.category;
  // if (description) description.textContent = eachOpp.description;

  return newItem;
};

/**
 * Collects all the categories from the products' data.
 * @param products The products' data.
 *
 * @returns An array of {@link Product} categories.
 */
// const collectCategories = (products: Product[]) => {
//   const categories: Set<Product['category']> = new Set();

//   for (const { category } of products) {
//     categories.add(category);
//   }

//   return [...categories];
// };

/**
 * Creates a new radio filter from the template element.
 * @param category The filter value.
 * @param templateElement The template element.
 *
 * @returns A new category radio filter.
 */
// const createFilter = (category: Product['category'], templateElement: HTMLLabelElement) => {
//   // Clone the template element
//   const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;

//   // Query inner elements
//   const label = newFilter.querySelector('span');
//   const radio = newFilter.querySelector('input');

//   if (!label || !radio) return;

//   // Populate inner elements
//   label.textContent = category;
//   radio.value = category;

//   return newFilter;
// };
