# Product Requirements Document



## Project: "What's For Dinner?" Recommendation App



### Overview





The "What's For Dinner?" application helps users decide what to eat by analyzing their recent meals and recommending cuisines they have not eaten recently.



The system tracks restaurants and home-cooked meals, categorizes them by cuisine type, and suggests dinner options that increase meal variety.



The primary goal is to reduce repetitive eating habits and simplify dinner decisions.



---



### Goals



##### Primary Goals

* Track meals eaten by the user
* Categorize meals by cuisine type
* Analyze recent meal history
* Recommend cuisine options not recently eaten



##### Secondary Goals

* Track favorite restaurants
* Identify frequent dining habits
* integrate restaurant metadata automatically via Google Maps API



---



### Target Users



##### Primary Users:



* Individuals who struggle to decide what to eat
* Couples deciding dinner options
* Users who frequently eat out or order takeout



##### Typical usage pattern:



1. User opens dashboard
2. View recent meals
3. Clicks "What's For Dinner?" button
4. App suggests cuisines or restaurants not recently eaten



---



### Core Features (Functional Requirements)



##### Meal Tracking



Users must be able to record meals they have eaten.



Required fields:

* Cuisine Type
* Restaurant Name or Homecooked
* Date



Optional Fields:

* Rating
* Notes



##### Meal History Dashboard



This system must display recent meals for the user.



Display requirements:

* Last 6 days to 13 meals
* Cuisine type
* Location (Restaurant name or home)
* Date (when did they eat this?)



Users should be able to:

* Delete entries
* Edit entries



##### Dinner Recommendation Engine



The System must provide cuisine recommendations when the user presses "What's For Dinner?" button.



The algorithm must:

1. Identify cuisines eaten in the past 6 days
2. Optionally check cuisines eaten in the past 13 days as per user preference
3. Exclude those cuisines from suggestions
4. Suggest cuisines not recently eaten



The system must return at least 1 recommendation, at most 3 recommendations



##### Restaurant Favorites



Users must be able to mark restaurants as favorites.



Favorite restaurants should:

* appear in recommendation suggestions
* influence recommendation scoring



##### User Identification



The system must support persistent user data.



This will be accomplished with anonymous user ID stored in browser cookie



---



### Non-Functional Requirements



##### Performance



API responses must return within 500ms



##### Privacy



The system must not collect personally identifiable information (PID).



Users are identified by anonymous UUIDs.



##### Security



All API requests must validate the user's UUID



Users may only access their own data.



##### Data Retention



Meal records are stored for 14 days, then cached for 30 days before they are deleted.

Favorites persists indefinitely.

Cookies last for 30 days, and if they expire, the user's data is orphaned and destroyed after 30 days.



##### Scalability



Can be scaled in multiple ways:

* Mobile App functionality that can either go as a lightweight user tool or full fledged application
* An optional login feature to allow users to persist indefinitely



### Stretch Features



These features are optional for the initial version



##### Restaurant Metadata Integration



The system may integrate with Google Maps API



This allows user to select a restaurant to retrieve restaurant metadata such as cuisine type, ratings, etc.



##### Habit Analysis



The system may identify patterns such as



* most visited restaurants
* most eaten cuisine
* weekly eating patterns



##### Smart Recommendations



Future recommendation scoring may include:



* Cuisine recency
* Favorite restaurants
* Restaurant ratings
* User Ratings
* Nearby options



---



### Data Model



##### Users



1. id (UUID)
2. created\_at



##### Meals



1. id
2. user\_id
3. location
4. cuisine
5. meal\_name
6. date
7. rating
8. notes



##### Restaurants



1. id
2. name
3. cuisine
4. google\_place\_id



##### Favorites



1. user\_id
2. restaurant\_id



---



### System Architecture



Frontend: React



Backend: Node.js API



Database: PostgreSQL



Hosting: Render Cloud Service





---



### User Interface Requirements



Dashboard must include:

* Recent meals list
* Add Meal Button
* "What's For Dinner?" button



---



### Deployment Requirements



The System must support cloud deployment

1. GitHub
2. Render Build
3. Automatic Deployment



---



### Development Phases



##### Phase 1 (MVP)



* Meal Tracking
* Dashboard
* Basic Recommendation algorithm
* anonymous users



##### Phase 2



* Favorites
* Improved recommendation scoring
* restaurant history



##### Phase 3 Stretch goals



* Google Map API integration
* Restaurant Metadata integration
* Habit Analysis



---



### Success Criteria



The product is successful if:



* Users can record meals easily
* The system reliably suggest varied cuisine options
* The recommendation feature improves meal variety
