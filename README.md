🎬 KinoScreens

KinoScreens is a modern web platform for discovering movies, exploring film details, and browsing cinematic content in a visually engaging way. It delivers a seamless user experience for movie lovers to search, explore, and stay updated with films.

🚀 Live Demo

👉 https://kinoscreens.com/

📌 Features
🔍 Movie Search – Easily search for movies by title
🎞️ Movie Details – View information like:
Title
Release date
Overview
Ratings
🖼️ Beautiful UI – Clean and responsive design for all devices
⚡ Fast Performance – Optimized for speed and smooth navigation
📱 Responsive Design – Works on desktop, tablet, and mobile
🧠 Inspiration

KinoScreens was inspired by modern movie discovery platforms and the idea of making film exploration simple, fast, and visually appealing.

🛠️ Tech Stack
Frontend: Next.js, React
Styling: Tailwind CSS
Backend / Data: API-based (e.g., movie database APIs)
Deployment: Vercel
📂 Project Structure
/app
/components
/lib
/public
/styles
⚙️ Installation

Clone the repository:

git clone https://github.com/your-username/kinoscreens.git
cd kinoscreens

Install dependencies:

npm install

Run the development server:

npm run dev
🔑 Environment Variables

Create a .env.local file and add:

NEXT_PUBLIC_API_KEY=your_api_key_here
📸 Screenshots

(Add screenshots of your UI here for better presentation)

<<<<<<< HEAD
## Production Integration Order

Follow this exact order to avoid booking-flow conflicts:

### 1) Real Supabase First

1. Create or reuse your Supabase project.
2. Run one SQL file in Supabase SQL editor:
	- Fresh setup: `supabase/migrations/20260525_private_cinema_bookings.sql`
	- Existing earlier table: `supabase/migrations/20260525_private_cinema_bookings_patch.sql`
3. Set environment values:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `SUPABASE_SERVICE_ROLE_KEY`
4. Verify slot availability works:
	- Open `/book`
	- Choose date and confirm unavailable slots still show as unavailable (not hidden).

### 2) Paystack Test Next

1. Set environment values:
	- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
	- `PAYSTACK_SECRET_KEY`
2. In Paystack dashboard, set webhook URL to:
	- `https://<your-domain>/api/paystack/webhook`
3. Run a test booking and verify:
	- Success redirects to `/book/success`
	- Failed/closed payment redirects to `/book/failed`
	- Paid booking locks slot in Supabase and UI.

### 3) Admin Auth After That

1. Set environment values:
	- `ADMIN_BASIC_USERNAME`
	- `ADMIN_BASIC_PASSWORD`
2. Visit `/admin/bookings` and confirm browser basic auth prompt appears.

### 4) Resend Last

1. Set environment values:
	- `RESEND_API_KEY`
	- `BOOKING_FROM_EMAIL`
2. Complete a successful test booking and confirm email delivery.

### Debug Note: Booking Date Availability

Booking APIs now enforce calendar-valid ISO dates (not only regex shape), plus Africa/Lagos "past date" checks, to reduce date mismatch issues.

## Learn More
=======
📈 Future Improvements
🔐 User authentication (login/signup)
❤️ Watchlist / Favorites feature
🎥 Trailer integration
⭐ Reviews and ratings system
🌍 Multi-language support
🤝 Contributing
>>>>>>> origin

Contributions are welcome!

Fork the repo
Create a new branch
Make your changes
Submit a pull request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Your Name

<<<<<<< HEAD
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## schema history and deployment record
use main migration for fresh setup

use patch only for older table versions
=======
GitHub: https://github.com/courageamayo
Portfolio: https://kinoscreens.com/
⭐ Support

If you like this project, give it a ⭐ on GitHub!
>>>>>>> origin
