"use client";
import { MapPin } from "lucide-react";
import { CONTACT } from "@/lib/site";
export function PincodeCheck() {
  return (
    <div className="selling-pincode">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const pincode = String(
            new FormData(event.currentTarget).get("pincode"),
          );
          window.location.assign(
            `${CONTACT.whatsappHref}?text=${encodeURIComponent(`Hi Hulumart, I want to sell a used item. Can you confirm availability in pincode ${pincode}?`)}`,
          );
        }}
      >
        <MapPin size={22} aria-hidden="true" />
        <label className="sr-only" htmlFor="selling-pincode">
          Enter your 6-digit pincode
        </label>
        <input
          id="selling-pincode"
          name="pincode"
          placeholder="Enter pincode"
          inputMode="numeric"
          pattern="[1-9][0-9]{5}"
          maxLength={6}
          required
          title="Enter a valid 6-digit Indian pincode"
          aria-describedby="pincode-help"
        />
        <button type="submit">Check</button>
      </form>
      <p id="pincode-help">
        Check selling availability in your 6-digit pincode with our team on
        WhatsApp.
      </p>
    </div>
  );
}
