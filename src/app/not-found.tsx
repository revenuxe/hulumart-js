import { permanentRedirect } from "next/navigation";

// Stale public URLs from the previous site should land visitors on the
// marketplace instead of leaving them on a dead-end page.
export default function NotFound() {
  permanentRedirect("/");
}
