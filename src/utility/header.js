/* eslint-disable no-undef */
const SHRINK_SCROLL_OFFSET = 40;

window.addEventListener("DOMContentLoaded", () => {
	const header = document.querySelector(".header");

	if (!header) {
		return;
	}

	const updateHeaderSize = () => {
		if (window.scrollY > SHRINK_SCROLL_OFFSET) {
			header.classList.add("header--shrink");
		} else {
			header.classList.remove("header--shrink");
		}
	};

	updateHeaderSize();
	window.addEventListener("scroll", updateHeaderSize, { passive: true });
});
