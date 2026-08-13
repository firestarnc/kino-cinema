import { formatNaira } from "@/lib/private-booking";
import { getActiveSlotBlocks, getRecentBookings } from "@/lib/private-booking-db";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminBookingsManager from "@/components/admin/AdminBookingsManager";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const [bookings, slotBlocks] = await Promise.all([
    getRecentBookings(120),
    getActiveSlotBlocks(120),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-foreground md:text-5xl">Booking Dashboard</h1>
            <p className="mt-2 font-outfit text-sm text-muted-foreground">Latest private cinema bookings from Supabase.</p>
          </div>
          <AdminLogoutButton />
        </div>
      </div>

      <AdminBookingsManager initialSlotBlocks={slotBlocks} />

      <div className="overflow-x-auto rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
        <table className="min-w-full">
          <thead className="border-b border-border/40 bg-background/40">
            <tr className="text-left">
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Customer</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Type</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Schedule</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Package</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Source</th>
              <th className="px-4 py-3 font-outfit text-xs uppercase tracking-wider text-muted-foreground">Reference</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center font-outfit text-sm text-muted-foreground">
                  No bookings found yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border/20 last:border-0">
                  <td className="px-4 py-3 font-outfit text-sm text-foreground/90">
                    {new Date(booking.created_at).toLocaleString("en-NG")}
                  </td>
                  <td className="px-4 py-3 font-outfit text-sm text-foreground/90">
                    <p>{booking.full_name}</p>
                    <p className="text-xs text-muted-foreground">{booking.email}</p>
                    <p className="text-xs text-muted-foreground">{booking.phone_number}</p>
                  </td>
                  <td className="px-4 py-3 font-outfit text-sm text-foreground/90">
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs uppercase tracking-wider text-gold">
                      {booking.booking_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-outfit text-sm text-foreground/90">
                    <p>{booking.booking_date}</p>
                    <p className="text-xs text-muted-foreground">{booking.time_slot}</p>
                  </td>
                  <td className="px-4 py-3 font-outfit text-sm text-foreground/90">
                    <p>{booking.package_name}</p>
                    <p className="text-xs text-gold">{formatNaira(booking.package_price_ngn)}</p>
                    {booking.additional_guests > 0 ? (
                      <p className="text-xs text-muted-foreground">Extra guests: {booking.additional_guests}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-outfit text-sm text-foreground/90">
                    {booking.booking_type === "movie-package"
                      ? `${booking.content_title ?? "To be selected in person"}${booking.content_platform ? ` • ${booking.content_platform}` : ""}`
                      : (booking.film_title ?? "Chosen in person")}
                  </td>
                  <td className="px-4 py-3 font-outfit text-sm">
                    <span className="rounded-full border border-cinema-gold/60 bg-cinema-gold/20 px-2 py-1 text-xs uppercase tracking-wider text-gold">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-outfit text-xs text-muted-foreground">
                    {booking.payment_source === "admin_direct" ? "Admin Direct" : "Online Paystack"}
                  </td>
                  <td className="px-4 py-3 font-outfit text-xs text-muted-foreground">{booking.paystack_reference}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
