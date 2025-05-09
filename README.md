# CS-304-Final-Project
# CS-304-Final-Project

Aura – Discover Accessories that Resonate With Your Energy
Aura provides users with a brand new jewelry shopping experience that is convenient, personalized, and fun. Aura is an online shopping website that sells jewelry and helps users discover pieces that best align with their energy. The most distinctive feature of Aura is its personalized accessory recommendations based on zodiac signs. When new users create a profile, they are prompted to enter their date of birth, which Aura uses to match them with accessories in its database.

Creators/Programmers:
Phoenix Chen
Nehal Farghaly
Joelle Liu 


The status of the project
The project is complete and all of its features work. Here is a breakdown of the features:
- Home page with our website motto where the user can see the different webpages that exist in the website, like login/signup, profile, crystals.

- Login/Sign up feature: where a new user is able to sign up or an existing user is able to log in. The sign-up page asks for username, password, as well as date of birth since our website relies on providing customized jewelry shopping that matches one's energy.

- The website uses a dynamic data collection for users that gets updated each time a user signs up, and login information is pulled from when an existing user is trying to login to their profile.

- Profile page: Both login and sign-up are connected to the profile page in a sense that once a user is able to successfully sign up or log in, they are automatically taken to their profile where they are able to view their information as well as the option to upload a profile picture.

- Uploading Profile Picture: This is where the user is able to upload something to the website, and the user collection is modified with the profile picture they have uploaded. We ensured that it is saved and when the user logs in again, that photo is still there.

- Crystal Page: this is where the collection of crystals that we sell is displayed. For each one, we have details about the crystal like its name, its color, what it is used for, price, and what type of jewelry piece it is. 

There are three features implemented on this page:
1. Sort feature: where the user can sort the crystals from low to high price or high to low price. Crystals are ordered by price in either ascending or descending order.
2. Filter feature: the user can use the filter feature to help them in their choices of crystals. They can choose to look at necklaces, bracelets, or rings.
3. Search feature: the user can write keywords that can help them in their search. Keywords could include information like color, its purpose (inner peace), and so on. There is also an option to search using zodiac sign.

-Add to Cart: On the crystal webpage, there is an option to add to cart that allows only logged-in users to do so. We did that to ensure that the cart feature is connected to the profile of the user.

-Cart Webpage: In this webpage, the user can find the items they have added to their cart from shopping on the crystals webpage.

Directions for use: 
There should be no issues accessing and running our code, but we thought of providing a list of the libraries we used and some clarifications in case you face any challenges running the code.

Among the importanat Libraries we usedused:
npm install express mongodb dotenv multer morgan serve-static body-parser express-session connect-flash bcrypt ejs tailwindcss jquery

Comments and remarks: 

1. After installing tailwindcss, you need to set up the configuration by running this line: npx tailwindcss init and to ompile Tailwind CSS, you’ll need PostCSS by running this code npm install postcss autoprefixer
2. For the profile page, we had to implement a diskstorage function to save the photo the user uploads in a public folder so you will need to create a public folder where all the photos are saved then The uploaded image is then rendered on the profile page where profileImage in the user collection contains the relative path to the image. so we needed to create this folder mkdir -p public/uploads

New implementations: 
Login, signup
profile
searching, filtering, and sorting in crytal webopage
add to cart feature
dynamic user interaction

Demonstaration video link:
https://drive.google.com/file/d/1Dzk3RRXYTdllFHgyWuoNLwU0xMDVYRlX/view?usp=drive_link 

Note: The video doesn't include the zodiac search feature and the user can't use the add to cart feature if not logged in. We were able to make these edits after we recorded the video and thought of putting it as a note.

Further improvement: 
Further improvements that could be added to enhance the website and user experience are:
1. Link the cart to the user profile.
Currently, the users collection doesn't include data about the items they are adding to their cart. So once the user logs out, the items in the cart aren't saved. This is an easy addition to our code, but we didn't have time to implement it. We acknowledge its importance in providing a smoother user experience.
2. Make a purchasing feature where the user is able to insert their cart information and buy the jewelry.
3. Link users' purchases to their profiles, where a user can see the previously bought jewelry on their profile page and have the option to write reviews for them and upload photos of themselves wearing the jewelry.
This feature will be linked to the crystal webpage as well, where we will add a "View Details" button to see the reviews other users have uploaded.