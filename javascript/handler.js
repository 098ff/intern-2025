import { setLang } from './set-lang.js';

document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll("[data-include]");
    const fetches = [...includes].map(el =>
        fetch(el.dataset.include)
            .then(res => res.text())
            .then(html => (el.innerHTML = html))
    );

    Promise.all(fetches).then(() => {
        const currentPath = window.location.pathname;

        // เอา 'current' class ออกจากทุก element ที่มี class นี้
        document.querySelectorAll(".current").forEach(el => {
            el.classList.remove("current");
        });

        document.querySelectorAll(".bar-left a[href]").forEach(a => {
            const aPath = new URL(a.href, location.origin).pathname;
            if (currentPath.endsWith(aPath)) {
                a.classList.add("current");
            }
        });

        document.querySelectorAll(".dropdown").forEach(drop => {
            const dropdownLinks = drop.querySelectorAll(".dropdown-content a[href]");
            const dropdownContent = drop.querySelector(".dropdown-content");
            let isDropdownMatched = false; // ตัวแปรตรวจเฉพาะ dropdown นี้

            dropdownContent.style.display = "none"; // ซ่อน dropdown content เมื่อเริ่มต้นหน้าใด ๆ

            dropdownLinks.forEach(link => {
                const linkPath = new URL(link.href, location.origin).pathname;
                if (currentPath.endsWith(linkPath)) {
                    link.classList.add("current");
                    isDropdownMatched = true; // มีลิงก์ตรงกัน
                }
            });

            // ถ้าเจอลิงก์ตรงกับหน้าใน dropdown นี้เท่านั้น
            if (isDropdownMatched) {
                drop.classList.add("current");
                drop.querySelector(".dropdown-content")?.classList.add("current");
            }
        });

        // การทำงานของ dropdown
        const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.closest(".dropdown");
            const content = dropdown.querySelector(".dropdown-content");

            toggle.addEventListener("click", e => {
                e.preventDefault();

                // ปิด dropdown อื่น ๆ ถ้ามี (optional)
                document.querySelectorAll(".dropdown-content").forEach(menu => {
                    if (menu !== content) menu.style.display = "none";
                });

                // toggle การแสดง dropdown นี้
                const isVisible = content.style.display === "flex";
                content.style.display = isVisible ? "none" : "flex";
            });
        });

        // ปิด dropdown ทุกครั้งที่คลิกเพื่อ navigate
        document.querySelectorAll(".dropdown-content a[href]").forEach(link => {
            link.addEventListener("click", () => {
                document.querySelectorAll(".dropdown-content").forEach(menu => {
                    menu.style.display = "none";
                });
                // เพิ่มด้วยถ้าอยากปิด side menu บน mobile
                document.getElementById("menu-side")?.classList.remove("show");
            });
        });

        // ปิด dropdown เมื่อคลิกที่ใด ๆ 
        document.addEventListener("click", e => {
            if (!e.target.closest(".dropdown")) {
                document.querySelectorAll(".dropdown-content").forEach(menu => {
                    menu.style.display = "none";
                });
            }
            const menuSide = document.getElementById("menu-side");
            const isMenuOpen = menuSide?.classList.contains("show");
            const clickedOutside = !e.target.closest("#menu-side") && !e.target.closest("#menu-toggle");

            if (menuSide && isMenuOpen && clickedOutside) {
                menuSide.classList.remove("show"); // หรือ menuSide.style.display = "none";
            }
        });



        // การทำงานของ Side menu
        const menuToggle = document.getElementById("menu-toggle");
        const menuSide = document.getElementById("menu-side");
        const closeButton = document.getElementById("btn-close");

        if (menuToggle && menuSide && closeButton) {
            menuToggle.addEventListener("click", () => {
                menuSide.classList.add("show");
            });

            closeButton.addEventListener("click", () => {
                menuSide.classList.remove("show");
            });
        } else {
            console.warn("ไม่เจอ menu-toggle หรือ btn-close หรือ menu-side");
        }

        document.querySelectorAll(".lang-toggle").forEach((btn) => {
            const container = btn.parentElement;
            const dropdown = container?.querySelector(".lang-dropdown");

            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const isVisible = dropdown?.style.display === "inline-block";
                if (dropdown) {
                    dropdown.style.display = isVisible ? "none" : "inline-block";
                }
            });

            dropdown?.addEventListener("click", (e) => {
                dropdown.style.display = "none";
            });
        });


        // ปิด dropdown ภาษา ถ้าคลิกที่อื่น
        document.addEventListener("click", e => {
            if (!e.target.closest(".lang-toggle")) {
                document.querySelectorAll(".lang-dropdown").forEach(menu => {
                    menu.style.display = "none";
                });
            }
        });

        // ใช้ภาษาที่ผู้ใช้เคยเลือกไว้ ถ้ายังไม่เคยเลือกจะ fallback เป็น 'th'
        const savedLang = localStorage.getItem("selectedLang") || 'th';
        setLang(savedLang);
    });
});
