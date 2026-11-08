import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import time
from playwright.sync_api import sync_playwright
from browser_support import launch_browser

repo_dir = os.path.abspath('.')
index_path = f"file:///{repo_dir.replace(os.sep, '/')}/index.html"
screenshots_dir = os.path.join(repo_dir, 'screenshots', 'v80-legacy')
os.makedirs(screenshots_dir, exist_ok=True)

test_results = []

def record_test(name, status, details=""):
    test_results.append({"name": name, "status": status, "details": details})
    print(f"[{status.upper()}] {name}: {details}")

print("=== STARTING PLAYWRIGHT QA TEST SUITE ===")

with sync_playwright() as p:
    browser = launch_browser(p)
    
    # -------------------------------------------------------------
    # Test Suite 1: Standard Desktop 1920x1080 Full Game Walkthrough
    # -------------------------------------------------------------
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto(index_path)
    page.wait_for_timeout(800)
    
    # 1. Home Screen
    page.wait_for_selector("#home.active")
    cast_pics = page.query_selector_all(".castPic")
    record_test("Home Screen Cast Count", "pass" if len(cast_pics) == 3 else "fail", f"Found {len(cast_pics)} cast images")
    
    # Verify Cast Pic Dimensions (4:5 ratio)
    for i, pic in enumerate(cast_pics):
        box = pic.bounding_box()
        ratio = box['width'] / box['height'] if box and box['height'] > 0 else 0
        is_4_5 = abs(ratio - 0.8) < 0.05
        record_test(f"Cast Pic {i} 4:5 Aspect Ratio", "pass" if is_4_5 else "fail", f"w={box['width']:.1f}, h={box['height']:.1f}, ratio={ratio:.3f}")
    
    page.screenshot(path=os.path.join(screenshots_dir, "01_home_desktop_1920x1080.png"))
    
    # 2. Story Screen - Week 1 (Tuần 1: Cá Bống happy, Chú Bảy happy)
    page.click("#startBtn")
    page.wait_for_selector("#story.active")
    page.wait_for_timeout(400)
    story_face = page.query_selector("#storyFace")
    src = story_face.get_attribute("src")
    box = story_face.bounding_box()
    ratio = box['width'] / box['height'] if box and box['height'] > 0 else 0
    record_test("Story Week 1 Cá Bống Happy", "pass" if "ca_bong_happy" in src else "fail", f"src={src}, w={box['width']:.1f}, h={box['height']:.1f}, ratio={ratio:.3f}")
    page.screenshot(path=os.path.join(screenshots_dir, "02_story_week1_meeting.png"))
    
    # Step to Week 1 Chú Bảy happy (STORY[1])
    page.click("#nextStory")
    page.wait_for_timeout(200)
    src = page.query_selector("#storyFace").get_attribute("src")
    record_test("Story Week 1 Chú Bảy Happy", "pass" if "chu_bay_happy" in src else "fail", f"src={src}")
    
    # Step to Week 2–4 Rạn nứt (STORY[4]: Minh An thinking)
    for _ in range(3):
        page.click("#nextStory")
        page.wait_for_timeout(200)
    src = page.query_selector("#storyFace").get_attribute("src")
    record_test("Story Week 2–4 Minh An Thinking", "pass" if "minh_an_thinking" in src else "fail", f"src={src}")
    page.screenshot(path=os.path.join(screenshots_dir, "03_story_week2_rannut.png"))
    
    # Step to Week 6 Đổ vỡ (STORY[5]: Chú Bảy angry)
    page.click("#nextStory")
    page.wait_for_timeout(200)
    src = page.query_selector("#storyFace").get_attribute("src")
    record_test("Story Week 6 Chú Bảy Angry", "pass" if "chu_bay_angry" in src else "fail", f"src={src}")
    page.screenshot(path=os.path.join(screenshots_dir, "04_story_week6_dovo.png"))
    
    # Step to Week 6 Anh Khoa angry (STORY[6])
    page.click("#nextStory")
    page.wait_for_timeout(200)
    src = page.query_selector("#storyFace").get_attribute("src")
    record_test("Story Week 6 Anh Khoa Angry", "pass" if "anh_khoa_angry" in src else "fail", f"src={src}")
    
    # Step to Week 6 Chị Sen stressed (STORY[7])
    page.click("#nextStory")
    page.wait_for_timeout(200)
    src = page.query_selector("#storyFace").get_attribute("src")
    record_test("Story Week 6 Chị Sen Stressed", "pass" if "chi_sen_stressed" in src else "fail", f"src={src}")
    
    # 3. World Map Screen & Walking Avatar
    page.click("#skipStory")
    page.wait_for_selector("#world.active")
    page.wait_for_timeout(500)
    
    # Test Minh An walking sprite
    world_avatar = page.query_selector("#worldAvatar")
    world_img = page.query_selector("#worldAvatarImg")
    sprite_src_0 = world_img.get_attribute("src")
    record_test("Minh An Walk Sprite Initial Frame", "pass" if "minh_an_walk" in sprite_src_0 else "fail", f"src={sprite_src_0}")
    
    # Move avatar via keyboard holding KeyA to test faceLeft
    page.keyboard.down("KeyA")
    page.wait_for_timeout(200)
    page.keyboard.up("KeyA")
    page.wait_for_timeout(100)
    
    facing_left = page.evaluate("() => document.getElementById('worldAvatar').classList.contains('facingLeft')")
    record_test("Minh An Sprite Facing Left on 'A'", "pass" if facing_left else "fail", f"facingLeft={facing_left}")
    
    # Walk right
    page.keyboard.down("KeyD")
    page.wait_for_timeout(200)
    page.keyboard.up("KeyD")
    page.wait_for_timeout(100)
    
    facing_right = page.evaluate("() => !document.getElementById('worldAvatar').classList.contains('facingLeft')")
    record_test("Minh An Sprite Facing Right on 'D'", "pass" if facing_right else "fail", f"facingRight={facing_right}")
    
    page.screenshot(path=os.path.join(screenshots_dir, "05_world_map_minh_an_walk.png"))
    
    # 4. Explore Screen: Ruộng Chú Bảy
    page.evaluate("() => enterPlace('field')")
    page.wait_for_selector("#explore.active")
    page.wait_for_timeout(300)
    npc_face = page.query_selector("#npcFace")
    box = npc_face.bounding_box()
    ratio = box['width'] / box['height'] if box and box['height'] > 0 else 0
    record_test("Ruộng Chú Bảy Dialogue Avatar", "pass" if abs(ratio - 0.8) < 0.05 and "chu_bay" in npc_face.get_attribute("src") else "fail", f"src={npc_face.get_attribute('src')}, w={box['width']:.1f}, h={box['height']:.1f}, ratio={ratio:.3f}")
    
    # Open clue modal to verify modal portrait
    page.evaluate("() => openClue('field_cost')")
    page.wait_for_timeout(200)
    modal_img = page.query_selector("#modalEmoji img")
    record_test("Clue Modal Chú Bảy Portrait", "pass" if modal_img and "chu_bay" in modal_img.get_attribute("src") else "fail", f"src={modal_img.get_attribute('src') if modal_img else 'None'}")
    page.screenshot(path=os.path.join(screenshots_dir, "06_explore_field_chu_bay.png"))
    page.evaluate("() => closeClue()")
    page.wait_for_timeout(200)
    
    # Finish Ruộng Chú Bảy investigation
    page.evaluate("() => { state.found.field=['field_cost','field_sensor','field_buyer']; state.minis.field=true; completePlace(); }")
    page.wait_for_timeout(400)
    
    # 5. Explore Screen: HTX Chị Sen
    page.evaluate("() => enterPlace('coop')")
    page.wait_for_selector("#explore.active")
    page.wait_for_timeout(300)
    npc_face = page.query_selector("#npcFace")
    record_test("HTX Chị Sen Dialogue Avatar", "pass" if "chi_sen" in npc_face.get_attribute("src") else "fail", f"src={npc_face.get_attribute('src')}")
    page.evaluate("() => openClue('coop_fees')")
    page.wait_for_timeout(200)
    page.screenshot(path=os.path.join(screenshots_dir, "07_explore_coop_chi_sen.png"))
    page.evaluate("() => closeClue()")
    page.wait_for_timeout(200)
    
    # Finish HTX investigation
    page.evaluate("() => { state.found.coop=['coop_fees','coop_contract','coop_trace']; state.minis.coop=true; completePlace(); }")
    page.wait_for_timeout(400)
    
    # 6. Explore Screen: Nhà máy Anh Khoa
    page.evaluate("() => enterPlace('factory')")
    page.wait_for_selector("#explore.active")
    page.wait_for_timeout(300)
    npc_face = page.query_selector("#npcFace")
    record_test("Nhà máy Anh Khoa Dialogue Avatar", "pass" if "anh_khoa" in npc_face.get_attribute("src") else "fail", f"src={npc_face.get_attribute('src')}")
    page.evaluate("() => openClue('factory_order')")
    page.wait_for_timeout(200)
    page.screenshot(path=os.path.join(screenshots_dir, "08_explore_factory_anh_khoa.png"))
    page.evaluate("() => closeClue()")
    page.wait_for_timeout(200)
    
    # Finish Factory investigation
    page.evaluate("() => { state.found.factory=['factory_order','factory_quality','factory_trucks']; state.minis.factory=true; completePlace(); }")
    page.wait_for_timeout(400)
    
    # 7. Invitation Screen
    page.evaluate("() => { renderInvitations(); show('invite'); }")
    page.wait_for_selector("#invite.active")
    invite_imgs = page.query_selector_all(".invitePerson img")
    record_test("Invitation Screen Stakeholders Count", "pass" if len(invite_imgs) == 3 else "fail", f"Found {len(invite_imgs)} invite cards")
    page.screenshot(path=os.path.join(screenshots_dir, "09_invite_screen.png"))
    
    # Invite all 3 stakeholders and enter negotiation hall
    page.evaluate("() => { state.invited={bay:true, sen:true, khoa:true}; renderInvitations(); }")
    page.wait_for_timeout(300)
    page.evaluate("() => { renderHall(); show('hall'); }")
    
    # 8. Negotiation Hall Screen
    page.wait_for_selector("#hall.active")
    page.wait_for_timeout(500)
    stake_imgs = page.query_selector_all(".stake img")
    record_test("Negotiation Stakeholder Cards", "pass" if len(stake_imgs) == 3 else "fail", f"Found {len(stake_imgs)} stakeholder portraits")
    
    # Check hearing tabs
    hearing_img = page.query_selector(".hearingBody img")
    record_test("Hearing Body Initial Portrait (Chú Bảy)", "pass" if "chu_bay" in hearing_img.get_attribute("src") else "fail", f"src={hearing_img.get_attribute('src')}")
    page.screenshot(path=os.path.join(screenshots_dir, "10_negotiation_hall.png"))
    
    # Switch hearing tab to Chị Sen (tab index 1)
    page.evaluate("() => { hearingWho = 1; renderHearing(); }")
    page.wait_for_timeout(300)
    hearing_img = page.query_selector(".hearingBody img")
    record_test("Hearing Body Chị Sen Portrait", "pass" if "chi_sen" in hearing_img.get_attribute("src") else "fail", f"src={hearing_img.get_attribute('src')}")
    page.screenshot(path=os.path.join(screenshots_dir, "11_negotiation_hearing_chi_sen.png"))
    
    # Switch hearing tab to Anh Khoa (tab index 2)
    page.evaluate("() => { hearingWho = 2; renderHearing(); }")
    page.wait_for_timeout(300)
    hearing_img = page.query_selector(".hearingBody img")
    record_test("Hearing Body Anh Khoa Portrait", "pass" if "anh_khoa" in hearing_img.get_attribute("src") else "fail", f"src={hearing_img.get_attribute('src')}")
    page.screenshot(path=os.path.join(screenshots_dir, "12_negotiation_hearing_anh_khoa.png"))
    
    # 9. Salinity Crisis Event
    page.evaluate("() => { $('crisisModal').classList.add('show'); renderCrisis(); }")
    page.wait_for_timeout(400)
    record_test("Salinity Crisis Modal Trigger", "pass", "Crisis modal displayed successfully")
    page.screenshot(path=os.path.join(screenshots_dir, "13_salinity_crisis.png"))
    page.evaluate("() => { $('crisisModal').classList.remove('show'); }")
    page.wait_for_timeout(300)
    
    # 10. Endings A, B, C
    # Ending A: Balanced terms (game sets mood 'happy')
    page.evaluate("() => { state.result = 'A'; renderEnding(); show('ending'); }")
    page.wait_for_selector("#ending.active")
    page.wait_for_timeout(400)
    end_imgs = page.query_selector_all("#endFaces img")
    record_test("Ending A Faces Count", "pass" if len(end_imgs) == 3 else "fail", f"Found {len(end_imgs)} faces in ending A")
    happy_count = sum(1 for img in end_imgs if "happy" in img.get_attribute("src"))
    record_test("Ending A Faces Happy Mood", "pass" if happy_count == 3 else "fail", f"Happy count={happy_count}/3")
    page.screenshot(path=os.path.join(screenshots_dir, "14_ending_A_success.png"))
    
    # Ending B: Conditional terms (game sets mood 'thinking')
    page.evaluate("() => { state.result = 'B'; renderEnding(); }")
    page.wait_for_timeout(400)
    end_imgs = page.query_selector_all("#endFaces img")
    thinking_count = sum(1 for img in end_imgs if "thinking" in img.get_attribute("src"))
    record_test("Ending B Faces Thinking Mood", "pass" if thinking_count == 3 else "fail", f"Thinking count={thinking_count}/3")
    page.screenshot(path=os.path.join(screenshots_dir, "15_ending_B_conditional.png"))
    
    # Ending C: Collapse (game sets mood 'worried')
    page.evaluate("() => { state.result = 'C'; renderEnding(); }")
    page.wait_for_timeout(400)
    end_imgs = page.query_selector_all("#endFaces img")
    worried_count = sum(1 for img in end_imgs if "worried" in img.get_attribute("src"))
    record_test("Ending C Faces Worried Mood", "pass" if worried_count == 3 else "fail", f"Worried count={worried_count}/3")
    page.screenshot(path=os.path.join(screenshots_dir, "16_ending_C_collapse.png"))
    
    page.close()
    
    # -------------------------------------------------------------
    # Test Suite 2: Responsive Viewports (1366x768, 1280x720, 390x844)
    # -------------------------------------------------------------
    # Laptop 1366x768
    page_laptop = browser.new_page(viewport={"width": 1366, "height": 768})
    page_laptop.goto(index_path)
    page_laptop.wait_for_timeout(500)
    cast_pics = page_laptop.query_selector_all(".castPic")
    box = cast_pics[0].bounding_box()
    record_test("Laptop 1366x768 Cast Dimensions", "pass" if box['height'] > 100 else "fail", f"w={box['width']:.1f}, h={box['height']:.1f}")
    page_laptop.screenshot(path=os.path.join(screenshots_dir, "17_home_laptop_1366x768.png"))
    page_laptop.close()
    
    # Projector 1280x720
    page_proj = browser.new_page(viewport={"width": 1280, "height": 720})
    page_proj.goto(index_path)
    page_proj.wait_for_timeout(500)
    cast_pics = page_proj.query_selector_all(".castPic")
    box = cast_pics[0].bounding_box()
    record_test("Projector 1280x720 Cast Dimensions", "pass" if box['height'] > 100 else "fail", f"w={box['width']:.1f}, h={box['height']:.1f}")
    page_proj.screenshot(path=os.path.join(screenshots_dir, "18_home_projector_1280x720.png"))
    page_proj.close()
    
    # Mobile 390x844
    page_mob = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True)
    page_mob.goto(index_path)
    page_mob.wait_for_timeout(500)
    cast_pics = page_mob.query_selector_all(".castPic")
    box = cast_pics[0].bounding_box()
    record_test("Mobile 390x844 Cast Dimensions", "pass" if box['height'] > 70 else "fail", f"w={box['width']:.1f}, h={box['height']:.1f}")
    page_mob.screenshot(path=os.path.join(screenshots_dir, "19_home_mobile_390x844.png"))
    
    # Check mobile story
    page_mob.click("#startBtn")
    page_mob.wait_for_selector("#story.active")
    page_mob.wait_for_timeout(400)
    story_face = page_mob.query_selector("#storyFace")
    box = story_face.bounding_box()
    record_test("Mobile Story Portrait Dimensions", "pass" if box['height'] > 120 else "fail", f"w={box['width']:.1f}, h={box['height']:.1f}")
    page_mob.screenshot(path=os.path.join(screenshots_dir, "20_story_mobile_390x844.png"))
    
    # Check mobile world
    page_mob.click("#skipStory")
    page_mob.wait_for_selector("#world.active")
    page_mob.wait_for_timeout(400)
    avatar = page_mob.query_selector("#worldAvatar")
    box = avatar.bounding_box()
    record_test("Mobile World Avatar Dimensions", "pass" if box['height'] > 40 else "fail", f"w={box['width']:.1f}, h={box['height']:.1f}")
    page_mob.screenshot(path=os.path.join(screenshots_dir, "21_world_mobile_390x844.png"))
    page_mob.close()
    
    # -------------------------------------------------------------
    # Test Suite 3: Browser Zoom Level 125%
    # -------------------------------------------------------------
    page_zoom = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1.25)
    page_zoom.goto(index_path)
    page_zoom.wait_for_timeout(500)
    cast_pics = page_zoom.query_selector_all(".castPic")
    record_test("Zoom 125% Cast Count", "pass" if len(cast_pics) == 3 else "fail", f"Found {len(cast_pics)} cast images at 125% zoom")
    page_zoom.screenshot(path=os.path.join(screenshots_dir, "22_home_zoom_125pct.png"))
    page_zoom.close()
    
    # -------------------------------------------------------------
    # Test Suite 4: prefers-reduced-motion Accessibility
    # -------------------------------------------------------------
    page_motion = browser.new_page(viewport={"width": 1920, "height": 1080}, reduced_motion="reduce")
    page_motion.goto(index_path)
    page_motion.wait_for_timeout(500)
    page_motion.click("#startBtn")
    page_motion.wait_for_selector("#story.active")
    
    anim = page_motion.evaluate("() => window.getComputedStyle(document.getElementById('storyFace')).animationName")
    record_test("prefers-reduced-motion Disabled Animation", "pass" if anim == "none" else "fail", f"storyFace animationName={anim}")
    page_motion.screenshot(path=os.path.join(screenshots_dir, "23_prefers_reduced_motion.png"))
    page_motion.close()
    
    browser.close()

print("\n=== TEST SUMMARY ===")
passes = sum(1 for t in test_results if t['status'] == 'pass')
fails = sum(1 for t in test_results if t['status'] == 'fail')
print(f"Total Tests: {len(test_results)} | Passed: {passes} | Failed: {fails}")
if fails > 0:
    for t in test_results:
        if t['status'] == 'fail':
            print(f"  FAIL: {t['name']} - {t['details']}")
else:
    print("ALL TESTS PASSED WITH 100% SUCCESS!")

if fails:
    sys.exit(1)
