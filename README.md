# Book Borrower Beacon

Please build a complete React web application for managing library book loans. The application must connect to Supabase for authentication and database management. 

App Name: "BiblioTech"
Goal: To track library users and the books they have borrowed, with full user authentication.
User Types: Librarians (Admins who manage the data).

Main Features & Functionalities:
1. User Authentication: Registration, Login, and Logout using Supabase Auth. Unauthenticated users can only see the Login/Register page.
2. Form for Borrowing Books: A form to record a new book loan. It should have fields for: User's First and Last Name, Book Title, and Borrow Date.
3. Database Connection: All data (borrowed books and users) must be saved to and fetched from a Supabase database. Please provide the necessary Supabase SQL schema so I can create the tables.
4. Users List: A page displaying a list of all users who have borrowed books.
5. Detail View: When clicking on a specific user's name from the list, it should open a detail view showing a list of all the books that specific user has currently borrowed.

Main Pages / Routing:
- /login and /register: Pages for authentication.
- / (Home): Dashboard with a welcome message and a summary.
- /add-loan: Page with the form to add a new borrowed book.
- /users: Page displaying the list of users.
- /users/:id : Detail page showing the user's info and their borrowed books.

Database Entities (Data to store in Supabase):
- Table "loans": id, user_full_name, book_title, borrow_date.

UI & Styling:
- Clean, modern, and minimalist design using Tailwind CSS.
- Use a clear navigation bar at the top with links to Home, Add Loan, Users, and a Logout button.
- Use card layouts for forms and clean tables/lists for data display.
- Add primary colors like deep blue or teal for buttons and active states.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://book-borrower-beacon.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c3a5cd4c-0cf6-4c60-b74a-b0a4596f8199).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
