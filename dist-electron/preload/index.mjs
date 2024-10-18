"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
function domReady(condition = ["complete", "interactive"]) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}
const safeDOM = {
  append(parent, child) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent, child) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  }
};
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");
  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    }
  };
}
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);
window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 4999);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi8uLi9lbGVjdHJvbi9wcmVsb2FkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlwY1JlbmRlcmVyLCBjb250ZXh0QnJpZGdlIH0gZnJvbSBcImVsZWN0cm9uXCI7XHJcblxyXG4vLyAtLS0tLS0tLS0gRXhwb3NlIHNvbWUgQVBJIHRvIHRoZSBSZW5kZXJlciBwcm9jZXNzIC0tLS0tLS0tLVxyXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKFwiaXBjUmVuZGVyZXJcIiwge1xyXG4gIG9uKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLm9uPikge1xyXG4gICAgY29uc3QgW2NoYW5uZWwsIGxpc3RlbmVyXSA9IGFyZ3M7XHJcbiAgICByZXR1cm4gaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgKGV2ZW50LCAuLi5hcmdzKSA9PlxyXG4gICAgICBsaXN0ZW5lcihldmVudCwgLi4uYXJncylcclxuICAgICk7XHJcbiAgfSxcclxuICBvZmYoLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIub2ZmPikge1xyXG4gICAgY29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJncztcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5vZmYoY2hhbm5lbCwgLi4ub21pdCk7XHJcbiAgfSxcclxuICBzZW5kKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIGlwY1JlbmRlcmVyLnNlbmQ+KSB7XHJcbiAgICBjb25zdCBbY2hhbm5lbCwgLi4ub21pdF0gPSBhcmdzO1xyXG4gICAgcmV0dXJuIGlwY1JlbmRlcmVyLnNlbmQoY2hhbm5lbCwgLi4ub21pdCk7XHJcbiAgfSxcclxuICBpbnZva2UoLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaXBjUmVuZGVyZXIuaW52b2tlPikge1xyXG4gICAgY29uc3QgW2NoYW5uZWwsIC4uLm9taXRdID0gYXJncztcclxuICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoY2hhbm5lbCwgLi4ub21pdCk7XHJcbiAgfSxcclxuXHJcbiAgLy8gWW91IGNhbiBleHBvc2Ugb3RoZXIgQVBUcyB5b3UgbmVlZCBoZXJlLlxyXG4gIC8vIC4uLlxyXG59KTtcclxuXHJcbi8vIC0tLS0tLS0tLSBQcmVsb2FkIHNjcmlwdHMgbG9hZGluZyAtLS0tLS0tLS1cclxuZnVuY3Rpb24gZG9tUmVhZHkoXHJcbiAgY29uZGl0aW9uOiBEb2N1bWVudFJlYWR5U3RhdGVbXSA9IFtcImNvbXBsZXRlXCIsIFwiaW50ZXJhY3RpdmVcIl1cclxuKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICBpZiAoY29uZGl0aW9uLmluY2x1ZGVzKGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XHJcbiAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGNvbmRpdGlvbi5pbmNsdWRlcyhkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xyXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5jb25zdCBzYWZlRE9NID0ge1xyXG4gIGFwcGVuZChwYXJlbnQ6IEhUTUxFbGVtZW50LCBjaGlsZDogSFRNTEVsZW1lbnQpIHtcclxuICAgIGlmICghQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmQoKGUpID0+IGUgPT09IGNoaWxkKSkge1xyXG4gICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHJlbW92ZShwYXJlbnQ6IEhUTUxFbGVtZW50LCBjaGlsZDogSFRNTEVsZW1lbnQpIHtcclxuICAgIGlmIChBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZCgoZSkgPT4gZSA9PT0gY2hpbGQpKSB7XHJcbiAgICAgIHJldHVybiBwYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgfVxyXG4gIH0sXHJcbn07XHJcblxyXG4vKipcclxuICogaHR0cHM6Ly90b2JpYXNhaGxpbi5jb20vc3BpbmtpdFxyXG4gKiBodHRwczovL2Nvbm5vcmF0aGVydG9uLmNvbS9sb2FkZXJzXHJcbiAqIGh0dHBzOi8vcHJvamVjdHMubHVrZWhhYXMubWUvY3NzLWxvYWRlcnNcclxuICogaHR0cHM6Ly9tYXRlamt1c3RlYy5naXRodWIuaW8vU3BpblRoYXRTaGl0XHJcbiAqL1xyXG5mdW5jdGlvbiB1c2VMb2FkaW5nKCkge1xyXG4gIGNvbnN0IGNsYXNzTmFtZSA9IGBsb2FkZXJzLWNzc19fc3F1YXJlLXNwaW5gO1xyXG4gIGNvbnN0IHN0eWxlQ29udGVudCA9IGBcclxuQGtleWZyYW1lcyBzcXVhcmUtc3BpbiB7XHJcbiAgMjUlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgxODBkZWcpIHJvdGF0ZVkoMCk7IH1cclxuICA1MCUgeyB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDE4MGRlZykgcm90YXRlWSgxODBkZWcpOyB9XHJcbiAgNzUlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDE4MGRlZyk7IH1cclxuICAxMDAlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDApOyB9XHJcbn1cclxuLiR7Y2xhc3NOYW1lfSA+IGRpdiB7XHJcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcclxuICB3aWR0aDogNTBweDtcclxuICBoZWlnaHQ6IDUwcHg7XHJcbiAgYmFja2dyb3VuZDogI2ZmZjtcclxuICBhbmltYXRpb246IHNxdWFyZS1zcGluIDNzIDBzIGN1YmljLWJlemllcigwLjA5LCAwLjU3LCAwLjQ5LCAwLjkpIGluZmluaXRlO1xyXG59XHJcbi5hcHAtbG9hZGluZy13cmFwIHtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgdG9wOiAwO1xyXG4gIGxlZnQ6IDA7XHJcbiAgd2lkdGg6IDEwMHZ3O1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGJhY2tncm91bmQ6ICMyODJjMzQ7XHJcbiAgei1pbmRleDogOTtcclxufVxyXG4gICAgYDtcclxuICBjb25zdCBvU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgY29uc3Qgb0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gIG9TdHlsZS5pZCA9IFwiYXBwLWxvYWRpbmctc3R5bGVcIjtcclxuICBvU3R5bGUuaW5uZXJIVE1MID0gc3R5bGVDb250ZW50O1xyXG4gIG9EaXYuY2xhc3NOYW1lID0gXCJhcHAtbG9hZGluZy13cmFwXCI7XHJcbiAgb0Rpdi5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPjxkaXY+PC9kaXY+PC9kaXY+YDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGFwcGVuZExvYWRpbmcoKSB7XHJcbiAgICAgIHNhZmVET00uYXBwZW5kKGRvY3VtZW50LmhlYWQsIG9TdHlsZSk7XHJcbiAgICAgIHNhZmVET00uYXBwZW5kKGRvY3VtZW50LmJvZHksIG9EaXYpO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZUxvYWRpbmcoKSB7XHJcbiAgICAgIHNhZmVET00ucmVtb3ZlKGRvY3VtZW50LmhlYWQsIG9TdHlsZSk7XHJcbiAgICAgIHNhZmVET00ucmVtb3ZlKGRvY3VtZW50LmJvZHksIG9EaXYpO1xyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5jb25zdCB7IGFwcGVuZExvYWRpbmcsIHJlbW92ZUxvYWRpbmcgfSA9IHVzZUxvYWRpbmcoKTtcclxuZG9tUmVhZHkoKS50aGVuKGFwcGVuZExvYWRpbmcpO1xyXG5cclxud2luZG93Lm9ubWVzc2FnZSA9IChldikgPT4ge1xyXG4gIGV2LmRhdGEucGF5bG9hZCA9PT0gXCJyZW1vdmVMb2FkaW5nXCIgJiYgcmVtb3ZlTG9hZGluZygpO1xyXG59O1xyXG5cclxuc2V0VGltZW91dChyZW1vdmVMb2FkaW5nLCA0OTk5KTtcclxuIl0sIm5hbWVzIjpbImNvbnRleHRCcmlkZ2UiLCJpcGNSZW5kZXJlciIsImFyZ3MiXSwibWFwcGluZ3MiOiI7O0FBR0FBLFNBQUFBLGNBQWMsa0JBQWtCLGVBQWU7QUFBQSxFQUM3QyxNQUFNLE1BQXlDO0FBQ3ZDLFVBQUEsQ0FBQyxTQUFTLFFBQVEsSUFBSTtBQUM1QixXQUFPQyxTQUFZLFlBQUE7QUFBQSxNQUFHO0FBQUEsTUFBUyxDQUFDLFVBQVVDLFVBQ3hDLFNBQVMsT0FBTyxHQUFHQSxLQUFJO0FBQUEsSUFBQTtBQUFBLEVBRTNCO0FBQUEsRUFDQSxPQUFPLE1BQTBDO0FBQy9DLFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQzNCLFdBQU9ELFNBQVksWUFBQSxJQUFJLFNBQVMsR0FBRyxJQUFJO0FBQUEsRUFDekM7QUFBQSxFQUNBLFFBQVEsTUFBMkM7QUFDakQsVUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUk7QUFDM0IsV0FBT0EsU0FBWSxZQUFBLEtBQUssU0FBUyxHQUFHLElBQUk7QUFBQSxFQUMxQztBQUFBLEVBQ0EsVUFBVSxNQUE2QztBQUNyRCxVQUFNLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSTtBQUMzQixXQUFPQSxTQUFZLFlBQUEsT0FBTyxTQUFTLEdBQUcsSUFBSTtBQUFBLEVBQzVDO0FBQUE7QUFBQTtBQUlGLENBQUM7QUFHRCxTQUFTLFNBQ1AsWUFBa0MsQ0FBQyxZQUFZLGFBQWEsR0FDNUQ7QUFDTyxTQUFBLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDOUIsUUFBSSxVQUFVLFNBQVMsU0FBUyxVQUFVLEdBQUc7QUFDM0MsY0FBUSxJQUFJO0FBQUEsSUFBQSxPQUNQO0FBQ0ksZUFBQSxpQkFBaUIsb0JBQW9CLE1BQU07QUFDbEQsWUFBSSxVQUFVLFNBQVMsU0FBUyxVQUFVLEdBQUc7QUFDM0Msa0JBQVEsSUFBSTtBQUFBLFFBQ2Q7QUFBQSxNQUFBLENBQ0Q7QUFBQSxJQUNIO0FBQUEsRUFBQSxDQUNEO0FBQ0g7QUFFQSxNQUFNLFVBQVU7QUFBQSxFQUNkLE9BQU8sUUFBcUIsT0FBb0I7QUFDMUMsUUFBQSxDQUFDLE1BQU0sS0FBSyxPQUFPLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxNQUFNLEtBQUssR0FBRztBQUNsRCxhQUFBLE9BQU8sWUFBWSxLQUFLO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPLFFBQXFCLE9BQW9CO0FBQzFDLFFBQUEsTUFBTSxLQUFLLE9BQU8sUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLE1BQU0sS0FBSyxHQUFHO0FBQ2pELGFBQUEsT0FBTyxZQUFZLEtBQUs7QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFDRjtBQVFBLFNBQVMsYUFBYTtBQUNwQixRQUFNLFlBQVk7QUFDbEIsUUFBTSxlQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FPcEIsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBb0JKLFFBQUEsU0FBUyxTQUFTLGNBQWMsT0FBTztBQUN2QyxRQUFBLE9BQU8sU0FBUyxjQUFjLEtBQUs7QUFFekMsU0FBTyxLQUFLO0FBQ1osU0FBTyxZQUFZO0FBQ25CLE9BQUssWUFBWTtBQUNaLE9BQUEsWUFBWSxlQUFlLFNBQVM7QUFFbEMsU0FBQTtBQUFBLElBQ0wsZ0JBQWdCO0FBQ04sY0FBQSxPQUFPLFNBQVMsTUFBTSxNQUFNO0FBQzVCLGNBQUEsT0FBTyxTQUFTLE1BQU0sSUFBSTtBQUFBLElBQ3BDO0FBQUEsSUFDQSxnQkFBZ0I7QUFDTixjQUFBLE9BQU8sU0FBUyxNQUFNLE1BQU07QUFDNUIsY0FBQSxPQUFPLFNBQVMsTUFBTSxJQUFJO0FBQUEsSUFDcEM7QUFBQSxFQUFBO0FBRUo7QUFJQSxNQUFNLEVBQUUsZUFBZSxrQkFBa0I7QUFDekMsV0FBVyxLQUFLLGFBQWE7QUFFN0IsT0FBTyxZQUFZLENBQUMsT0FBTztBQUN0QixLQUFBLEtBQUssWUFBWSxtQkFBbUIsY0FBYztBQUN2RDtBQUVBLFdBQVcsZUFBZSxJQUFJOyJ9
