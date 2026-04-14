from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000/")

    # Mock state
    page.evaluate("""
        () => {
            localStorage.setItem('fd_user', JSON.stringify({id: 'user-1', name: 'Test User', phone: '1234567890'}));
            localStorage.setItem('fd_onboarding_complete', 'true');
        }
    """)
    page.reload()
    page.wait_for_timeout(1000)

    # Go to settings page
    page.goto("http://localhost:3000/settings")
    page.wait_for_timeout(2000)

    # Focus dark mode switch
    page.locator('button[role="switch"]').focus()
    page.wait_for_timeout(500)

    page.screenshot(path="/home/jules/verification/screenshots/settings_focus.png")

    # Toggle dark mode
    page.keyboard.press("Space")
    page.wait_for_timeout(500)

    page.screenshot(path="/home/jules/verification/screenshots/settings_dark_mode.png")
    page.wait_for_timeout(1000)


if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    os.makedirs("/home/jules/verification/videos", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
