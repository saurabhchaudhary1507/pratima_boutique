# Requirements Document

## Introduction

This document specifies the requirements for a ladies wear clothing boutique showcase website. The website serves as a digital storefront and discovery platform for the boutique. Customers can browse collections, explore new arrivals, and curate a personal selection list to bring with them when visiting the boutique in person. There is no online payment or checkout — all purchases are completed during the in-store visit. The site must reflect an elegant, feminine brand identity and perform well on all devices.

## Glossary

- **Website**: The ladies wear boutique showcase web application.
- **Customer**: A visitor who browses the Website to discover and plan their in-store purchases.
- **Boutique**: The ladies wear clothing business that owns and operates the Website.
- **Product**: A clothing item or accessory listed on the Website.
- **Collection**: A curated group of Products sharing a season, theme, or style.
- **Category**: A classification grouping Products by type (e.g., dresses, tops, trousers, accessories).
- **Selection_List**: A temporary, browser-stored list of Products a Customer curates to bring to the Boutique for in-store purchase. Functionally equivalent to a wishlist.
- **New_Arrivals**: Products added to the Website within the most recent 30-day period.
- **Admin**: A staff member of the Boutique with access to the website management interface.
- **CMS**: The Content Management System used by the Admin to update Website content and the Product catalogue.
- **Filter**: A refinement mechanism that narrows displayed Products by attributes such as Category, size, or colour.
- **Gallery**: A set of images displayed for a single Product.

---

## Requirements

### Requirement 1: Homepage and Brand Showcase

**User Story:** As a Customer, I want an attractive, informative homepage, so that I can immediately understand the boutique's style and discover what is new or featured.

#### Acceptance Criteria

1. THE Website SHALL display a homepage that includes a hero banner, a New_Arrivals section, and at least one featured Collection section.
2. THE Website SHALL display the New_Arrivals section on the homepage featuring up to 8 Products added within the most recent 30-day period, ordered by date added descending. IF fewer than 8 Products exist within the 30-day window, THE Website SHALL display all available New_Arrivals Products in that section.
3. WHEN an Admin publishes a new banner via the CMS, THE Website SHALL display that banner on the homepage within 60 seconds of publication.
4. THE Website SHALL display each Product in the New_Arrivals and featured Collection sections with a thumbnail image, Product name, and current price (discounted price where applicable).
5. WHEN a Customer clicks a Product shown in the homepage New_Arrivals or Collection section, THE Website SHALL navigate to that Product's detail page.
6. IF no Products exist within the 30-day New_Arrivals window, THEN THE Website SHALL display the 8 most recently added Products in the New_Arrivals section with no "New" badge.

---

### Requirement 2: Product Catalogue Browsing

**User Story:** As a Customer, I want to browse the full product catalogue, so that I can discover all available clothing and accessories before my visit to the boutique.

#### Acceptance Criteria

1. THE Website SHALL display a Catalogue page listing all non-deactivated Products, showing a thumbnail image, Product name, and price for each Product. The default sort order on initial page load SHALL be newest first.
2. WHEN a Customer selects a Category, THE Website SHALL display only the non-deactivated Products belonging to that Category.
3. WHEN a Customer applies a Filter, THE Website SHALL refresh the displayed Products to show only those matching all active Filter criteria simultaneously.
4. THE Website SHALL display the total count of Products currently shown in the active browse or search context, updating in real-time as filters or sort options change.
5. THE Website SHALL allow a Customer to sort displayed Products by newest first, price low to high, and price high to low.
6. WHEN a Product is a New_Arrival (added within the most recent 30-day period), THE Website SHALL display a "New" badge on that Product's thumbnail in the Catalogue.
7. IF a Product's current price is lower than its original price, THEN THE Website SHALL display a "Sale" badge on that Product's thumbnail in the Catalogue.
8. WHEN a Customer applies Filters that match no Products, THE Website SHALL display a message indicating no Products match the active filters and provide a link to clear all filters.

---

### Requirement 3: Product Detail Page

**User Story:** As a Customer, I want to view detailed information about a product, so that I can decide whether to include it in my selection for my boutique visit.

#### Acceptance Criteria

1. WHEN a Customer selects a Product, THE Website SHALL display a Product detail page showing the Product Gallery, name, description, available sizes, available colours, and price.
2. WHERE a Product Gallery contains more than one image, THE Website SHALL display navigation controls (previous and next) for the Gallery.
3. WHEN a Customer activates a Gallery navigation control, THE Website SHALL display the corresponding image.
4. WHEN a Product has an original price higher than the current price, THE Website SHALL display the original price with a struck-through style and the current price in a contrasting style, with both values visible simultaneously.
5. WHEN a Product variant (size or colour combination) is out of stock, THE Website SHALL display a visible text label "Out of Stock" for that variant, meeting WCAG 2.1 AA contrast requirements, on the Product detail page.
6. THE Website SHALL display an "Add to Selection List" button on each Product detail page that meets WCAG 2.1 AA contrast requirements.
7. WHEN a Customer selects an out-of-stock variant and attempts to activate the "Add to Selection List" button, THE Website SHALL display a message indicating that variant is unavailable and SHALL NOT add it to the Selection_List.
8. THE Website SHALL display between 1 and 6 related Products at the bottom of the Product detail page, prioritising Products from the same Collection before falling back to the same Category.

---

### Requirement 4: Product Search

**User Story:** As a Customer, I want to search for products by keyword, so that I can quickly find specific items without browsing through the full catalogue.

#### Acceptance Criteria

1. THE Website SHALL provide a search input field accessible from every page of the Website.
2. WHEN a Customer submits a search term (up to 200 characters), THE Website SHALL return a results page listing all non-deactivated Products whose name, description, or Category contains the search term using case-insensitive substring matching. Each result SHALL display a thumbnail image, Product name, and price, and clicking a result SHALL navigate to that Product's detail page.
3. WHEN a search returns no matching Products, THE Website SHALL display a message indicating no results were found and provide a link to the full Catalogue.
4. WHEN a Customer submits an empty search term or a search term exceeding 200 characters, THE Website SHALL display a validation message and maintain the current page state.

---

### Requirement 5: Selection List (In-Store Wishlist)

**User Story:** As a Customer, I want to curate a personal selection list of items I like, so that I can bring this list to the boutique and try or purchase those items during my visit.

#### Acceptance Criteria

1. WHEN a Customer clicks "Add to Selection List" on a Product detail page, THE Website SHALL add that Product (with the selected size and colour) to the Customer's Selection_List and display a visual confirmation message for a minimum of 2 seconds.
2. WHEN a Customer attempts to add a Product variant (same Product, size, and colour) already present in the Selection_List, THE Website SHALL display a message indicating the item is already in the Selection_List and leave the Selection_List unchanged.
3. THE Website SHALL display the Selection_List as a dedicated page showing each saved Product's thumbnail image, name, selected size (if applicable), selected colour (if applicable), and price.
4. THE Website SHALL display the total count of Products in the Selection_List at all times using a visible indicator in the site navigation.
5. WHEN a Customer activates the remove action for a Product in the Selection_List, THE Website SHALL remove that Product from the Selection_List and update the displayed list immediately.
6. THE Website SHALL persist the Selection_List across browser sessions using local storage so that a Customer's selections are retained when they return to the site.
7. WHEN a Customer activates the "Clear All" action on the Selection_List, THE Website SHALL display a confirmation prompt. IF the Customer confirms, THEN THE Website SHALL empty the Selection_List and display the empty state.
8. IF the Selection_List is empty, THEN THE Website SHALL display a message indicating the list is empty and provide a link to the Catalogue.
9. THE Website SHALL display a prominent note on the Selection_List page explaining that purchases are completed in-store at the Boutique and that the list is intended to guide the Customer's visit.
10. WHEN a Customer is on a Product detail page and has not yet selected both a size and a colour (where those options exist for the Product), THE Website SHALL display the "Add to Selection List" button in a disabled state with an inline prompt instructing the Customer to select a size and/or colour before adding.

---

### Requirement 6: Collections

**User Story:** As a Customer, I want to browse curated collections, so that I can discover coordinated outfits and themed groupings of clothing.

#### Acceptance Criteria

1. THE Website SHALL provide a Collections page listing all Collections not deactivated by an Admin, with a cover image and Collection name for each.
2. WHEN a Customer selects a Collection, THE Website SHALL display a dedicated Collection page showing all non-deactivated Products in that Collection, with each Product displaying a thumbnail image, name, and price.
3. THE Website SHALL display a Collection description and cover image at the top of each Collection page.
4. WHEN an Admin creates, updates, deactivates, or deletes a Collection via the CMS, THE Website SHALL reflect the changes on the Collections page within 60 seconds.
5. IF a Collection contains no non-deactivated Products, THEN THE Website SHALL display a message on that Collection's page indicating no Products are currently available in this Collection.

---

### Requirement 7: Responsive Design and Accessibility

**User Story:** As a Customer, I want the website to work well on any device and be accessible to all users, so that I can browse comfortably on my phone, tablet, or desktop.

#### Acceptance Criteria

1. THE Website SHALL render without overlapping elements, clipped content, or a horizontal scrollbar on screen widths from 320 px to 2560 px.
2. THE Website SHALL provide non-empty alt text for all Product images and banner images that conveys the subject of the image. Decorative images SHALL use empty alt text (`alt=""`).
3. THE Website SHALL ensure all interactive elements (buttons, links, form fields) are keyboard-navigable and have visible focus indicators with a minimum contrast ratio of 3:1 between the indicator colour and adjacent colours, in accordance with WCAG 2.1 AA.
4. THE Website SHALL use colour contrast ratios that comply with WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for large text) for all body text and interactive elements.
5. THE Website SHALL display a navigation menu accessible on both desktop and mobile screen widths. WHEN the screen width is below 768 px, THE Website SHALL collapse the navigation to a hamburger menu icon. WHEN a Customer activates the hamburger icon, THE Website SHALL expand the full navigation menu, and WHEN activated again, SHALL collapse it.

---

### Requirement 8: Content Management

**User Story:** As an Admin, I want to manage the product catalogue and website content without writing code, so that I can keep the site current and attractive for customers.

#### Acceptance Criteria

1. THE CMS SHALL allow an Admin to create, edit, and deactivate Products, including uploading up to 10 images per Product, and setting name, description, price, original price, sizes, colours, and stock status per variant. The CMS SHALL require name, price, and at least one size/colour/stock variant before allowing a Product to be saved.
2. THE CMS SHALL allow an Admin to create, edit, and deactivate Collections, including assigning Products to one or more Collections and setting a cover image and description.
3. THE CMS SHALL allow an Admin to update homepage content, including hero banners and the featured Collection selection. New_Arrivals on the homepage SHALL be auto-derived from the Glossary definition (Products added within 30 days) and SHALL NOT require manual Admin selection.
4. WHEN an Admin deactivates a Product, THE Website SHALL remove that Product from all Catalogue, Collection, search result pages, and any Customer's Selection_List within 60 seconds.
5. THE CMS SHALL allow an Admin to set and update the Category assignments for any Product.
6. WHEN an Admin attempts to save a Product with one or more missing required fields, THE CMS SHALL reject the save operation and display a message identifying each missing required field.

---

### Requirement 9: SEO and Performance

**User Story:** As the Boutique, I want the website to load quickly and appear in search engine results, so that more potential customers can discover the boutique online.

#### Acceptance Criteria

1. THE Website SHALL generate a unique HTML `<title>` tag (maximum 60 characters, including the entity name and boutique name) and a unique `<meta description>` tag (maximum 160 characters) for the homepage, each Product detail page, each Category page, and each Collection page.
2. THE Website SHALL generate a `sitemap.xml` file listing all public-facing pages, accessible at `/sitemap.xml`.
3. THE Website SHALL serve all Product and banner images in WebP or AVIF format, falling back to JPEG or PNG for browsers that do not support those formats.
4. THE Website SHALL apply lazy loading to all Product and banner images that are below the visible viewport on initial page load. The first visible image in the viewport on each page SHALL NOT be lazy-loaded, to avoid Largest Contentful Paint degradation.
5. THE Website SHALL use human-readable URL slugs for Product, Category, and Collection pages, using only lowercase letters, digits, and hyphens (e.g., `/products/floral-wrap-dress`, `/collections/summer-2025`).
6. THE Website SHALL achieve a Google Lighthouse performance score of 80 or above using the default mobile preset for the homepage, Catalogue page, and Product detail pages.

---

### Requirement 10: Boutique Information

**User Story:** As a Customer, I want to find the boutique's contact details and location, so that I can plan my in-store visit.

#### Acceptance Criteria

1. THE Website SHALL display the Boutique's physical address, phone number, and business hours on a dedicated Contact or Visit Us page. Business hours SHALL be displayed in the format "Day–Day: HH:MM–HH:MM" (e.g., "Mon–Sat: 10:00–19:00").
2. THE Website SHALL display an embedded map showing the Boutique's location on the Contact or Visit Us page.
3. THE Website SHALL display the Boutique's contact information (address and phone number) in the site footer on every page.
4. WHEN a Customer submits a contact enquiry form with all required fields (name, email address, and message body) completed, THE Website SHALL send the enquiry to the Boutique's designated email address and display a confirmation message acknowledging receipt of the enquiry.
5. IF the contact enquiry form is submitted with any required field (name, email address, or message body) missing, THEN THE Website SHALL display a validation message identifying each missing field and retain all other entered form data.
6. IF the enquiry email fails to send, THEN THE Website SHALL display an error message informing the Customer that the submission could not be completed and asking them to try again, while retaining all entered form data.
