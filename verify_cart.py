from playwright.sync_api import sync_playwright, expect
import os

def verify_fuel_cart():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create directory for video if it doesn't exist
        os.makedirs("/home/jules/verification/video", exist_ok=True)

        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()

        try:
            # Go to the app
            page.goto("http://localhost:3000")
            page.wait_for_timeout(2000)

            # Start ordering fuel
            # Based on the screenshot of a typical app like this, it might be a button or link
            # Let's try to find it by text
            page.get_by_text("Order Fuel").first.click()
            page.wait_for_timeout(1000)

            # Add a vehicle if needed (check if "No vehicles found" is present)
            if page.get_by_text("No vehicles found").is_visible():
                page.get_by_text("Go to Garage").click()
                page.wait_for_timeout(500)
                page.get_by_placeholder("Make (e.g. Toyota)").fill("Toyota")
                page.get_by_placeholder("Model (e.g. Camry)").fill("Camry")
                page.get_by_placeholder("ABC-1234").fill("ABC-123")
                page.get_by_role("button", name="Add Vehicle").click()
                page.wait_for_timeout(500)

                # Add another one for cart multi-item test
                page.get_by_role("button", name="Add Vehicle").first.click() # if there's a button to add more
                # Actually let's just go back to order
                page.goto("http://localhost:3000/order")
                page.wait_for_timeout(500)

            # Let's assume vehicles are there now.
            # Select first vehicle
            page.locator(".snap-start").first.click()
            page.wait_for_timeout(500)

            # Enter amount
            page.get_by_placeholder("Enter amount").fill("1000")
            page.wait_for_timeout(500)

            # Click Add to Cart
            # The text is "Add to Cart & Select Another Vehicle" or similar
            page.get_by_text("Add to Cart").click()
            page.wait_for_timeout(500)

            # Open Cart
            # The cart badge has a shopping cart icon
            page.locator("button:has(.lucide-shopping-cart)").click()
            page.wait_for_timeout(1000)

            # Take screenshot of the cart
            page.screenshot(path="/home/jules/verification/verification.png")
            page.wait_for_timeout(1000)

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_fuel_cart()
