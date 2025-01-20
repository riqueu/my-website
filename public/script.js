function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.onmousedown = function (e) {
    // Prevent dragging on double-click
    if (e.detail === 2) {
      return;
    }
    // Clear text selection on single click
    clearSelection();
    dragMouseDown(e);
  };

  elmnt.ondblclick = function (e) {
    // Allow word selection on double-click
    const selection = window.getSelection();
    const range = document.createRange();

    const wordRange = getWordRangeAtPoint(e.clientX, e.clientY);
    if (wordRange) {
      selection.removeAllRanges();
      selection.addRange(wordRange);
    }
  };

  elmnt.onmouseup = function (e) {
    // Handle triple-click to select the entire paragraph
    if (e.detail === 3) {
      const selection = window.getSelection();
      const range = document.createRange();
      const paragraph = getClosestParagraph(e.target);
      if (paragraph) {
        range.selectNodeContents(paragraph);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function clearSelection() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges(); // Clear any selected text
    } else if (document.selection) {
      document.selection.empty(); // Clear selected text for older browsers
    }
  }

  // Helper function to get the word range at a specific point
  function getWordRangeAtPoint(x, y) {
    const range = document.caretRangeFromPoint(x, y);
    if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;
      let start = startOffset,
        end = endOffset;

      // Expand the range to cover the word
      while (
        start > 0 &&
        range.startContainer.textContent[start - 1].match(/\S/)
      ) {
        start--;
      }
      while (
        end < range.startContainer.textContent.length &&
        range.startContainer.textContent[end].match(/\S/)
      ) {
        end++;
      }

      const wordRange = document.createRange();
      wordRange.setStart(range.startContainer, start);
      wordRange.setEnd(range.startContainer, end);
      return wordRange;
    }
    return null;
  }

  // Helper function to find the closest paragraph element
  function getClosestParagraph(element) {
    while (element && element !== elmnt) {
      if (element.tagName.toLowerCase() === "p") {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var elements = document.getElementsByClassName("drag");
  for (var i = 0; i < elements.length; i++) {
    dragElement(elements[i]);
  }

  // Add event listener to clear text selection on click outside elements
  document.addEventListener("mousedown", function (e) {
    var isDragging = e.detail !== 2; // Check if it's not a double-click
    if (isDragging) {
      clearSelection();
    }
  });

  let zIndex = 1;
  document.querySelectorAll(".drag").forEach((el) => {
    el.style.zIndex = zIndex++;
    el.addEventListener("mousedown", () => {
      el.style.zIndex = ++zIndex;
    });
  });

  document.getElementById("album_cover").addEventListener("click", function () {
    var sound = document.getElementById("mysound");
    if (sound) {
      sound.volume = 0.2;
      if (sound.paused) {
        setTimeout(function () {
          sound.play();
        }, 20); // 100ms delay
      } else {
        sound.pause();
      }
    }
  });
});
