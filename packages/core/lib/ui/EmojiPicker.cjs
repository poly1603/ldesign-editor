/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

const EMOJI_CATEGORIES = {
  smileys: {
    name: "\u7B11\u8138",
    emojis: ["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F605}", "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}", "\u{1F642}", "\u{1F609}", "\u{1F60C}", "\u{1F60D}", "\u{1F970}", "\u{1F618}", "\u{1F617}", "\u{1F619}", "\u{1F61A}", "\u{1F60B}", "\u{1F61B}", "\u{1F61C}", "\u{1F92A}", "\u{1F61D}", "\u{1F911}", "\u{1F917}", "\u{1F92D}", "\u{1F92B}", "\u{1F914}", "\u{1F910}", "\u{1F928}", "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1F60F}", "\u{1F612}", "\u{1F644}", "\u{1F62C}", "\u{1F925}", "\u{1F60C}", "\u{1F614}", "\u{1F62A}", "\u{1F924}", "\u{1F634}", "\u{1F637}", "\u{1F912}", "\u{1F915}", "\u{1F922}", "\u{1F92E}", "\u{1F927}", "\u{1F975}", "\u{1F976}", "\u{1F974}", "\u{1F635}", "\u{1F92F}", "\u{1F620}", "\u{1F621}", "\u{1F92C}"]
  },
  gestures: {
    name: "\u624B\u52BF",
    emojis: ["\u{1F44B}", "\u{1F91A}", "\u{1F590}", "\u270B", "\u{1F596}", "\u{1F44C}", "\u{1F90F}", "\u270C\uFE0F", "\u{1F91E}", "\u{1F91F}", "\u{1F918}", "\u{1F919}", "\u{1F448}", "\u{1F449}", "\u{1F446}", "\u{1F595}", "\u{1F447}", "\u261D\uFE0F", "\u{1F44D}", "\u{1F44E}", "\u270A", "\u{1F44A}", "\u{1F91B}", "\u{1F91C}", "\u{1F44F}", "\u{1F64C}", "\u{1F450}", "\u{1F932}", "\u{1F91D}", "\u{1F64F}", "\u270D\uFE0F", "\u{1F485}", "\u{1F933}", "\u{1F4AA}"]
  },
  hearts: {
    name: "\u7231\u5FC3",
    emojis: ["\u2764\uFE0F", "\u{1F9E1}", "\u{1F49B}", "\u{1F49A}", "\u{1F499}", "\u{1F49C}", "\u{1F5A4}", "\u{1F90D}", "\u{1F90E}", "\u{1F494}", "\u2763\uFE0F", "\u{1F495}", "\u{1F49E}", "\u{1F493}", "\u{1F497}", "\u{1F496}", "\u{1F498}", "\u{1F49D}", "\u{1F49F}"]
  },
  animals: {
    name: "\u52A8\u7269",
    emojis: ["\u{1F436}", "\u{1F431}", "\u{1F42D}", "\u{1F439}", "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}", "\u{1F428}", "\u{1F42F}", "\u{1F981}", "\u{1F42E}", "\u{1F437}", "\u{1F43D}", "\u{1F438}", "\u{1F435}", "\u{1F648}", "\u{1F649}", "\u{1F64A}", "\u{1F412}", "\u{1F414}", "\u{1F427}", "\u{1F426}", "\u{1F424}", "\u{1F423}", "\u{1F425}", "\u{1F986}", "\u{1F985}", "\u{1F989}", "\u{1F987}", "\u{1F43A}", "\u{1F417}", "\u{1F434}", "\u{1F984}", "\u{1F41D}", "\u{1F41B}", "\u{1F98B}", "\u{1F40C}", "\u{1F41E}", "\u{1F41C}"]
  },
  food: {
    name: "\u98DF\u7269",
    emojis: ["\u{1F34F}", "\u{1F34E}", "\u{1F350}", "\u{1F34A}", "\u{1F34B}", "\u{1F34C}", "\u{1F349}", "\u{1F347}", "\u{1F353}", "\u{1F348}", "\u{1F352}", "\u{1F351}", "\u{1F96D}", "\u{1F34D}", "\u{1F965}", "\u{1F95D}", "\u{1F345}", "\u{1F346}", "\u{1F951}", "\u{1F966}", "\u{1F96C}", "\u{1F952}", "\u{1F336}", "\u{1F33D}", "\u{1F955}", "\u{1F9C4}", "\u{1F9C5}", "\u{1F954}", "\u{1F360}", "\u{1F950}", "\u{1F96F}", "\u{1F35E}", "\u{1F956}", "\u{1F968}", "\u{1F9C0}", "\u{1F95A}", "\u{1F373}", "\u{1F9C8}", "\u{1F95E}", "\u{1F9C7}", "\u{1F953}", "\u{1F969}", "\u{1F357}", "\u{1F356}", "\u{1F9B4}", "\u{1F32D}", "\u{1F354}", "\u{1F35F}", "\u{1F355}", "\u{1F96A}"]
  }
};
function showEmojiPicker(button, onSelect) {
  const existingPicker = document.querySelector(".ldesign-emoji-picker");
  if (existingPicker) {
    existingPicker.remove();
    return;
  }
  const picker = document.createElement("div");
  picker.className = "ldesign-emoji-picker";
  picker.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 8px;
    width: 380px;
    max-height: 320px;
    overflow-y: auto;
    z-index: 10000;
    animation: fadeIn 0.2s ease-out;
  `;
  const tabs = document.createElement("div");
  tabs.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
  `;
  const emojiContainer = document.createElement("div");
  emojiContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
  `;
  Object.entries(EMOJI_CATEGORIES).forEach(([key, category], index) => {
    const tab = document.createElement("button");
    tab.textContent = category.name;
    tab.style.cssText = `
      padding: 4px 12px;
      border: none;
      background: ${index === 0 ? "#4f46e5" : "#f3f4f6"};
      color: ${index === 0 ? "white" : "#374151"};
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    `;
    tab.onmouseover = () => {
      if (tab.style.backgroundColor !== "rgb(79, 70, 229)")
        tab.style.backgroundColor = "#e5e7eb";
    };
    tab.onmouseout = () => {
      if (tab.style.backgroundColor !== "rgb(79, 70, 229)")
        tab.style.backgroundColor = "#f3f4f6";
    };
    tab.onclick = () => {
      tabs.querySelectorAll("button").forEach((btn) => {
        btn.style.backgroundColor = "#f3f4f6";
        btn.style.color = "#374151";
      });
      tab.style.backgroundColor = "#4f46e5";
      tab.style.color = "white";
      emojiContainer.innerHTML = "";
      category.emojis.forEach((emoji) => {
        const emojiBtn = document.createElement("button");
        emojiBtn.textContent = emoji;
        emojiBtn.style.cssText = `
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          border-radius: 4px;
          transition: background 0.2s;
        `;
        emojiBtn.onmouseover = () => {
          emojiBtn.style.backgroundColor = "#f3f4f6";
        };
        emojiBtn.onmouseout = () => {
          emojiBtn.style.backgroundColor = "transparent";
        };
        emojiBtn.onclick = () => {
          if (onSelect)
            onSelect(emoji);
          else
            document.execCommand("insertText", false, emoji);
          picker.remove();
        };
        emojiContainer.appendChild(emojiBtn);
      });
    };
    tabs.appendChild(tab);
    if (index === 0)
      tab.click();
  });
  picker.appendChild(tabs);
  picker.appendChild(emojiContainer);
  const rect = button.getBoundingClientRect();
  picker.style.top = `${rect.bottom + 5}px`;
  picker.style.left = `${rect.left}px`;
  setTimeout(() => {
    const pickerRect = picker.getBoundingClientRect();
    if (pickerRect.right > window.innerWidth)
      picker.style.left = `${window.innerWidth - pickerRect.width - 10}px`;
    if (pickerRect.bottom > window.innerHeight)
      picker.style.top = `${rect.top - pickerRect.height - 5}px`;
  }, 0);
  document.body.appendChild(picker);
  setTimeout(() => {
    const closeOnClickOutside = (e) => {
      const target = e.target;
      if (button.contains(target))
        return;
      if (!picker.contains(target)) {
        picker.remove();
        document.removeEventListener("click", closeOnClickOutside);
      }
    };
    document.addEventListener("click", closeOnClickOutside);
  }, 100);
}

exports.showEmojiPicker = showEmojiPicker;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=EmojiPicker.cjs.map
