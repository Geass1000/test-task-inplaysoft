Inplaysoft Angular Test Scenarios
1. Please provide a website developed with Angular with below functionalities.
 - a. Requires a login page. Credentials can be checked hard-coded, no backend check is required.
 - b. All other pages can be accessible after authentication.
 - c. A page should be developed to collect crypto currency rates and store in ngrx. The api ‘https://api.coingecko.com/api/v3/exchange_rates’ can be used to get the currency rates. Currency rates should be retrieved periodically, this period should be able to be chosen by the user from the page. It can be an input or a select element with pre-defined values. By default, it should be every 15 seconds. Please note that all other functionalities will use that currency rates. It means that the application is not responsible for the previous prices of the currencies, but should store the currencies rates which it retrieves.
 - d. After getting each currency rates, each rate must be compared with the previous value. Depending on the difference between the previous and the current values, an icon must be shown to the user to let them know the last change of the currency. For instance, a green up icon can be shown when the price goes high, or a red down icon if the price goes down, and another icon if the rate is same. Those icons must be shown in a limited time, and again users must be able to change the time which they want to see the icons on the page.
 - e. For each currency, average prices of the currencies’ must be shown for last 1 minute, 2 minutes, 3 minutes and 5 minutes, as well as the lowest and the highest prices of the currency.
 - f. A button(or a link) must be added to the page, when users click that element, they must be redirected to the report page.
 - g. On the report page, all currency rates must be shown in a line chart.
 - h. Second button or link must be added to the main page and this button must redirect page to another page where we list all currency rate changes on a grid. Grid must be filterable. Please use free version of ag-grid. https://www.ag-grid.com/
 - i. On home page, we should be able to clear all data by clicking a button.
 - j. All pages must be responsive.
