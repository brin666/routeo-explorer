const MENU_FIRST = { menu: 0, dish: 1, environment: 2, reference: 3 };

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const parsed = new URL(value, document.baseURI);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? value : "";
  } catch {
    return "";
  }
}

function isFinitePrice(value) {
  return value !== null && value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
}

function formatPrice(value) {
  return Number(value).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
}

function legacyAverage(price) {
  if (typeof price !== "string" || !/(人均|每人)/.test(price)) return null;
  const match = price.match(/[¥￥]\s*([\d,]+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[1].replaceAll(",", ""));
  return Number.isFinite(value) ? value : null;
}

function normalizedPhotos(photos) {
  if (!Array.isArray(photos)) return [];
  return photos
    .map((photo, index) => {
      if (!photo || !safeUrl(photo.image)) return null;
      const kind = Object.hasOwn(MENU_FIRST, photo.kind) ? photo.kind : "dish";
      const image = safeUrl(photo.image);
      return {
        ...photo,
        kind,
        index,
        image,
        displayImage: safeUrl(photo.displayImage) || image,
        thumbnailImage: safeUrl(photo.thumbnailImage) || safeUrl(photo.displayImage) || image,
        url: safeUrl(photo.url)
      };
    })
    .filter(Boolean)
    .sort((a, b) => MENU_FIRST[a.kind] - MENU_FIRST[b.kind] || a.index - b.index);
}

function normalizedPrice(item) {
  const price = item.perPerson && typeof item.perPerson === "object" ? item.perPerson : null;
  if (price?.status === "tea-menu-conflict") {
    return {
      kind: "tea-menu-conflict",
      values: [...new Set((Array.isArray(price.values) ? price.values : []).filter(isFinitePrice).map(Number))],
      source: String(price.source || "").trim(),
      url: safeUrl(price.url)
    };
  }
  if (price?.status === "tea-only") {
    return {
      kind: "tea-only",
      value: isFinitePrice(price.value) ? Number(price.value) : null,
      source: String(price.source || item.source || "").trim(),
      url: safeUrl(price.url || item.url)
    };
  }
  if (price?.status === "platform-average") {
    return {
      kind: "platform-average",
      value: isFinitePrice(price.value) ? Number(price.value) : null,
      source: String(price.source || item.source || "").trim(),
      url: safeUrl(price.url || item.url)
    };
  }
  if (!price || !price.status) {
    const value = legacyAverage(item.price);
    if (value !== null) {
      return {
        kind: "platform-average",
        value,
        source: String(item.source || "").trim(),
        url: safeUrl(item.url)
      };
    }
  }
  return {
    kind: "unknown",
    value: null,
    source: "",
    url: ""
  };
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export class DiningGallery {
  constructor(host, items = []) {
    if (!(host instanceof HTMLElement)) throw new TypeError("DiningGallery needs an HTMLElement host.");
    this.host = host;
    this.items = (Array.isArray(items) ? items : []).map((item) => this.normalizeItem(item));
    this.active = true;
    this.destroyed = false;
    this.hoverIndex = null;
    this.focusIndex = null;
    this.hideTimer = null;
    this.opener = null;
    this.restoreFocus = false;

    this.render();
    this.createPreview();
    this.createDialog();
    this.bindEvents();
  }

  normalizeItem(item = {}) {
    return {
      ...item,
      name: String(item.name || "餐饮推荐"),
      area: String(item.area || ""),
      cuisine: String(item.cuisine || ""),
      address: String(item.address || ""),
      dishes: String(item.dishes || ""),
      displayNote: String(item.displayNote || ""),
      perPerson: normalizedPrice(item),
      photos: normalizedPhotos(item.photos)
    };
  }

  render() {
    this.host.replaceChildren();
    if (!this.items.length) {
      this.host.append(createElement("p", "route-dining-card__empty", "这条路线的餐饮推荐正在补充，具体分店、人均与菜单确认后会一起展示。"));
      return;
    }
    const fragment = document.createDocumentFragment();
    this.items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "route-dining-card";
      article.dataset.diningCard = "";
      article.dataset.diningIndex = String(index);

      const meta = createElement("span", "route-dining-card__meta");
      meta.textContent = [item.area, item.cuisine].filter(Boolean).join(" · ");
      article.append(meta);
      article.append(createElement("h3", "route-dining-card__title", item.name));
      if (item.address) article.append(createElement("p", "route-dining-card__address", `地址：${item.address}`));
      if (item.dishes) article.append(createElement("p", "route-dining-card__dishes", item.dishes));

      const pricing = this.renderPrice(item.perPerson);
      article.append(pricing);
      if (item.displayNote) article.append(createElement("p", "route-dining-card__note", item.displayNote));

      if (item.photos.length) {
        const hasMenu = item.photos.some((photo) => photo.kind === "menu");
        article.append(createElement("span", "route-dining-card__photos-label", `${hasMenu ? "看菜单与餐品" : "看餐品"} · ${item.photos.length} 张`));
        const openButton = createElement("button", "route-dining-card__open");
        openButton.type = "button";
        openButton.dataset.diningOpen = "";
        openButton.setAttribute("aria-label", `打开${item.name}的${hasMenu ? "菜单与餐品" : "餐品"}照片，共 ${item.photos.length} 张`);
        article.append(openButton);
      } else {
        article.append(createElement("p", "route-dining-card__empty", "暂无可查看的菜单与菜品照片"));
      }
      fragment.append(article);
    });
    this.host.append(fragment);
  }

  renderPrice(price) {
    const row = createElement("div", "route-dining-card__price-row");
    const label = createElement("strong", "route-dining-card__price");
    if (price.kind === "tea-menu-conflict" && price.values.length) {
      label.textContent = `茶价记录 ${price.values.map((value) => `¥${formatPrice(value)}`).join(" / ")}/杯`;
    } else if (price.kind === "platform-average" && price.value !== null) {
      label.textContent = `人均 ¥${formatPrice(price.value)}`;
    } else if (price.kind === "tea-only" && price.value !== null) {
      label.textContent = `茶饮参考 ¥${formatPrice(price.value)}/人`;
    } else {
      label.textContent = "人均待核实";
    }
    row.append(label);

    if (price.source) {
      const source = createElement(price.url ? "a" : "span", "route-dining-card__source", price.source);
      if (price.url) {
        source.href = price.url;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.setAttribute("aria-label", `查看价格来源：${price.source}（新窗口打开）`);
      }
      row.append(source);
    }
    return row;
  }

  createPreview() {
    this.preview = createElement("aside", "route-dining-preview");
    this.preview.hidden = true;
    this.preview.setAttribute("aria-hidden", "true");
    this.previewImage = createElement("img", "route-dining-preview__image");
    this.previewImage.alt = "";
    this.previewStatus = createElement("p", "route-dining-preview__status", "");
    this.previewCaption = createElement("span", "route-dining-preview__caption", "");
    this.preview.append(this.previewImage, this.previewStatus, this.previewCaption);
    document.body.append(this.preview);

    this.onPreviewPointerEnter = () => this.clearHideTimer();
    this.onPreviewPointerLeave = () => {
      this.hoverIndex = null;
      this.schedulePreviewSync();
    };
    this.preview.addEventListener("pointerenter", this.onPreviewPointerEnter);
    this.preview.addEventListener("pointerleave", this.onPreviewPointerLeave);
  }

  createDialog() {
    this.dialog = createElement("dialog", "route-dining-gallery");
    this.dialog.setAttribute("aria-label", "餐饮菜单与菜品照片");
    const header = createElement("header", "route-dining-gallery__header");
    this.dialogTitle = createElement("h2", "route-dining-gallery__title");
    this.closeButton = createElement("button", "route-dining-gallery__close", "关闭");
    this.closeButton.type = "button";
    this.closeButton.setAttribute("aria-label", "关闭照片画廊");
    this.closeButton.autofocus = true;
    header.append(this.dialogTitle, this.closeButton);

    const stage = createElement("div", "route-dining-gallery__stage");
    this.stage = stage;
    this.previousButton = createElement("button", "route-dining-gallery__previous", "上一张");
    this.previousButton.type = "button";
    this.previousButton.setAttribute("aria-label", "上一张照片");
    this.mainImage = createElement("img", "route-dining-gallery__image");
    this.mainImage.alt = "";
    this.mainImage.decoding = "async";
    this.nextButton = createElement("button", "route-dining-gallery__next", "下一张");
    this.nextButton.type = "button";
    this.nextButton.setAttribute("aria-label", "下一张照片");
    stage.append(this.previousButton, this.mainImage, this.nextButton);
    this.rotateButton = createElement("button", "route-dining-gallery__rotate", "旋转图片");
    this.rotateButton.type = "button";
    this.rotateButton.addEventListener("click", () => {
      this.rotation = ((this.rotation || 0) + 90) % 360;
      this.updateImageRotation();
    });
    header.insertBefore(this.rotateButton, this.closeButton);

    this.imageStatus = createElement("p", "route-dining-gallery__status");
    this.imageStatus.setAttribute("role", "status");
    this.imageStatus.setAttribute("aria-live", "polite");
    this.caption = createElement("div", "route-dining-gallery__caption");
    this.photoTitle = createElement("strong", "route-dining-gallery__photo-title");
    this.photoCount = createElement("span", "route-dining-gallery__count");
    this.photoKind = createElement("span", "route-dining-gallery__kind");
    this.photoCredit = createElement("span", "route-dining-gallery__credit");
    this.photoSourceName = createElement("span", "route-dining-gallery__source-name");
    this.caption.append(this.photoTitle, this.photoKind, this.photoCredit, this.photoSourceName, this.photoCount);
    this.photoSource = createElement("a", "route-dining-gallery__source", "查看这张照片的来源 ↗");
    this.photoSource.target = "_blank";
    this.photoSource.rel = "noopener noreferrer";

    this.thumbnails = createElement("div", "route-dining-gallery__thumbnails");
    this.thumbnails.setAttribute("role", "group");
    this.thumbnails.setAttribute("aria-label", "选择菜单或菜品照片");
    this.dialog.append(header, stage, this.imageStatus, this.caption, this.photoSource, this.thumbnails);
    document.body.append(this.dialog);

    this.onDialogClose = () => this.handleDialogClose();
    this.onDialogCancel = () => { this.restoreFocus = true; };
    this.onDialogClick = (event) => {
      if (event.target === this.dialog) this.closeGallery(true);
      const thumb = event.target.closest("[data-dining-photo-index]");
      if (thumb && this.dialog.contains(thumb)) this.selectPhoto(Number(thumb.dataset.diningPhotoIndex));
    };
    this.onDialogKeydown = (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target.closest("a, input, textarea, select")) return;
      event.preventDefault();
      this.movePhoto(event.key === "ArrowLeft" ? -1 : 1);
    };
    this.closeButton.addEventListener("click", () => this.closeGallery(true));
    this.previousButton.addEventListener("click", () => this.movePhoto(-1));
    this.nextButton.addEventListener("click", () => this.movePhoto(1));
    this.dialog.addEventListener("close", this.onDialogClose);
    this.dialog.addEventListener("cancel", this.onDialogCancel);
    this.dialog.addEventListener("click", this.onDialogClick);
    this.dialog.addEventListener("keydown", this.onDialogKeydown);
  }

  bindEvents() {
    this.onHostClick = (event) => {
      if (event.target.closest("a")) return;
      const card = event.target.closest("[data-dining-card]");
      if (!card || !this.host.contains(card) || !this.active) return;
      const button = card.querySelector("[data-dining-open]");
      if (!button) return;
      this.openGallery(Number(card.dataset.diningIndex), button);
    };
    this.onPointerOver = (event) => {
      if (!this.active || !this.isFinePointer()) return;
      const card = event.target.closest("[data-dining-card]");
      if (!card || !this.host.contains(card)) return;
      if (event.target.closest("a")) return;
      if (event.relatedTarget && card.contains(event.relatedTarget)) return;
      const index = Number(card.dataset.diningIndex);
      if (!this.items[index]?.photos.length) return;
      this.clearHideTimer();
      this.hoverIndex = index;
      this.syncPreview();
    };
    this.onPointerOut = (event) => {
      if (!this.isFinePointer()) return;
      const card = event.target.closest("[data-dining-card]");
      if (!card || !this.host.contains(card)) return;
      if (event.relatedTarget && card.contains(event.relatedTarget)) return;
      if (event.relatedTarget === this.preview || this.preview.contains(event.relatedTarget)) return;
      this.hoverIndex = null;
      this.schedulePreviewSync();
    };
    this.onFocusIn = (event) => {
      const card = event.target.closest("[data-dining-card]");
      if (!card || !this.host.contains(card)) return;
      if (event.target.closest("a")) {
        this.focusIndex = null;
        this.syncPreview();
        return;
      }
      const index = Number(card.dataset.diningIndex);
      if (!this.items[index]?.photos.length) return;
      this.focusIndex = index;
      this.syncPreview();
    };
    this.onFocusOut = (event) => {
      const card = event.target.closest("[data-dining-card]");
      if (!card || !this.host.contains(card)) return;
      if (event.relatedTarget && card.contains(event.relatedTarget)) return;
      this.focusIndex = null;
      this.schedulePreviewSync();
    };
    this.onWindowChange = () => {
      if (!this.preview.hidden) this.updatePreviewPlacement();
      if (this.dialog.open) this.updateImageRotation();
    };
    this.host.addEventListener("click", this.onHostClick);
    this.host.addEventListener("pointerover", this.onPointerOver);
    this.host.addEventListener("pointerout", this.onPointerOut);
    this.host.addEventListener("focusin", this.onFocusIn);
    this.host.addEventListener("focusout", this.onFocusOut);
    window.addEventListener("resize", this.onWindowChange, { passive: true });
    window.addEventListener("scroll", this.onWindowChange, { passive: true, capture: true });
  }

  isFinePointer() {
    return window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;
  }

  openGallery(index, opener) {
    const item = this.items[index];
    if (!this.active || !item?.photos.length || this.dialog.open) return;
    this.activeItem = item;
    this.activeIndex = index;
    this.photoIndex = 0;
    this.opener = opener;
    this.restoreFocus = true;
    this.dialogTitle.textContent = `${item.name} · ${item.photos.some((photo) => photo.kind === "menu") ? "菜单与餐品" : "餐品照片"}`;
    this.renderThumbnails();
    this.selectPhoto(0);
    this.dialog.showModal();
    this.updateImageRotation();
    this.closeButton.focus({ preventScroll: true });
    this.setPreviewSelection(null, "");
  }

  renderThumbnails() {
    this.thumbnails.replaceChildren();
    this.activeItem.photos.forEach((photo, index) => {
      const button = createElement("button", "route-dining-gallery__thumbnail");
      button.type = "button";
      button.dataset.diningPhotoIndex = String(index);
      button.setAttribute("aria-label", `${photoKindLabel(photo.kind)}：${photo.title || this.activeItem.name}`);
      const image = createElement("img", "route-dining-gallery__thumbnail-image");
      image.alt = "";
      image.loading = "lazy";
      const unavailable = createElement("span", "route-dining-gallery__thumbnail-error", "图片无法加载");
      unavailable.hidden = true;
      image.addEventListener("error", () => {
        image.hidden = true;
        unavailable.hidden = false;
      }, { once: true });
      image.src = photo.thumbnailImage || photo.image;
      button.append(image, unavailable);
      this.thumbnails.append(button);
    });
  }

  selectPhoto(index) {
    if (!this.activeItem?.photos.length) return;
    const count = this.activeItem.photos.length;
    this.photoIndex = ((index % count) + count) % count;
    const photo = this.activeItem.photos[this.photoIndex];
    this.rotation = [90, 180, 270].includes(Number(photo.rotation)) ? Number(photo.rotation) : 0;
    this.updateImageRotation();
    this.mainImage.hidden = false;
    this.mainImage.alt = photo.title || `${this.activeItem.name} · ${photoKindLabel(photo.kind)}`;
    this.imageStatus.textContent = "";
    this.imageStatus.hidden = true;
    this.mainImage.onerror = () => {
      this.mainImage.hidden = true;
      this.imageStatus.hidden = false;
      this.imageStatus.textContent = "这张照片暂时无法加载。";
    };
    this.mainImage.onload = () => {
      this.mainImage.hidden = false;
      this.imageStatus.hidden = true;
    };
    this.mainImage.src = photo.image;
    this.photoTitle.textContent = photo.title || this.activeItem.name;
    this.photoKind.textContent = photoKindLabel(photo.kind);
    this.photoCredit.textContent = photo.credit ? `来源署名：${photo.credit}` : "";
    this.photoSourceName.textContent = photo.source ? `图片来源：${photo.source}` : "";
    this.photoCount.textContent = `${this.photoIndex + 1} / ${count}`;
    this.photoSource.hidden = !photo.url;
    if (photo.url) this.photoSource.href = photo.url;
    else this.photoSource.removeAttribute("href");
    this.thumbnails.querySelectorAll("[data-dining-photo-index]").forEach((button) => {
      const selected = Number(button.dataset.diningPhotoIndex) === this.photoIndex;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  movePhoto(offset) {
    if (!this.dialog.open) return;
    this.selectPhoto(this.photoIndex + offset);
  }

  updateImageRotation() {
    const quarterTurn = (this.rotation || 0) % 180 !== 0;
    const bounds = this.stage.getBoundingClientRect();
    Object.assign(this.mainImage.style, {
      position: "absolute", left: "50%", top: "50%",
      width: quarterTurn && bounds.height ? `${bounds.height}px` : "100%",
      height: quarterTurn && bounds.width ? `${bounds.width}px` : "100%",
      transform: `translate(-50%, -50%) rotate(${this.rotation || 0}deg)`
    });
  }

  closeGallery(restoreFocus) {
    if (!this.dialog.open) return;
    this.restoreFocus = Boolean(restoreFocus);
    this.dialog.close();
  }

  handleDialogClose() {
    const opener = this.opener;
    const shouldRestore = this.restoreFocus && this.active && opener?.isConnected;
    this.activeItem = null;
    this.opener = null;
    this.restoreFocus = false;
    if (shouldRestore) opener.focus({ preventScroll: true });
  }

  setPreviewSelection(index, mode) {
    const item = this.items[index];
    const photo = item?.photos[0];
    if (!item || !photo) {
      this.preview.hidden = true;
      this.preview.removeAttribute("data-placement");
      this.previewImage.removeAttribute("src");
      this.previewStatus.textContent = "";
      return;
    }
    this.preview.hidden = false;
    this.preview.dataset.mode = mode;
    this.previewCaption.textContent = `${item.name} · ${photoKindLabel(photo.kind)}`;
    this.previewImage.alt = "";
    this.previewStatus.textContent = "";
    this.previewImage.hidden = false;
    this.previewImage.onerror = () => {
      this.previewImage.hidden = true;
      this.previewStatus.textContent = "这张照片暂时无法加载。";
    };
    this.previewImage.onload = () => {
      this.previewImage.hidden = false;
      this.previewStatus.textContent = "";
    };
    this.previewImage.src = photo.displayImage || photo.image;
    this.updatePreviewPlacement();
  }

  syncPreview() {
    if (!this.active || this.dialog?.open) {
      this.preview.hidden = true;
      return;
    }
    const index = this.hoverIndex ?? this.focusIndex;
    if (index === null || index === undefined) {
      this.preview.hidden = true;
      return;
    }
    this.setPreviewSelection(index, this.hoverIndex !== null ? "pointer" : "keyboard");
  }

  updatePreviewPlacement() {
    if (this.preview.hidden) return;
    const pane = this.host.closest(".route-curtain") || this.host;
    const bounds = pane.getBoundingClientRect();
    const rightRoom = window.innerWidth - bounds.right;
    const leftRoom = bounds.left;
    const required = 320;
    const placement = rightRoom >= required ? "right" : leftRoom >= required ? "left" : rightRoom >= leftRoom ? "right" : "left";
    this.preview.dataset.placement = placement;
    const width = Math.min(288, window.innerWidth - 24);
    const height = 228;
    const index = this.hoverIndex ?? this.focusIndex;
    const card = this.host.querySelector(`[data-dining-index="${index}"]`);
    const cardBounds = card?.getBoundingClientRect() || bounds;
    const x = placement === "left" ? bounds.left - width - 14 : bounds.right + 14;
    const y = cardBounds.top + (cardBounds.height - height) / 2;
    this.preview.style.left = `${Math.max(12, Math.min(window.innerWidth - width - 12, x))}px`;
    this.preview.style.top = `${Math.max(12, Math.min(window.innerHeight - height - 12, y))}px`;
  }

  schedulePreviewSync() {
    this.clearHideTimer();
    this.hideTimer = window.setTimeout(() => {
      this.hideTimer = null;
      this.syncPreview();
    }, 110);
  }

  clearHideTimer() {
    if (this.hideTimer !== null) window.clearTimeout(this.hideTimer);
    this.hideTimer = null;
  }

  setActive(active) {
    if (this.destroyed) return;
    this.active = Boolean(active);
    if (this.active) return;
    this.hoverIndex = null;
    this.focusIndex = null;
    this.clearHideTimer();
    this.preview.hidden = true;
    this.closeGallery(false);
  }

  destroy() {
    if (this.destroyed) return;
    this.setActive(false);
    this.destroyed = true;
    this.clearHideTimer();
    this.host.removeEventListener("click", this.onHostClick);
    this.host.removeEventListener("pointerover", this.onPointerOver);
    this.host.removeEventListener("pointerout", this.onPointerOut);
    this.host.removeEventListener("focusin", this.onFocusIn);
    this.host.removeEventListener("focusout", this.onFocusOut);
    window.removeEventListener("resize", this.onWindowChange);
    window.removeEventListener("scroll", this.onWindowChange, true);
    this.preview.removeEventListener("pointerenter", this.onPreviewPointerEnter);
    this.preview.removeEventListener("pointerleave", this.onPreviewPointerLeave);
    this.dialog.removeEventListener("close", this.onDialogClose);
    this.dialog.removeEventListener("cancel", this.onDialogCancel);
    this.dialog.removeEventListener("click", this.onDialogClick);
    this.dialog.removeEventListener("keydown", this.onDialogKeydown);
    this.preview.remove();
    this.dialog.remove();
    this.host.replaceChildren();
  }
}

function photoKindLabel(kind) {
  if (kind === "menu") return "菜单";
  if (kind === "environment") return "店内环境";
  if (kind === "reference") return "门店参考图";
  return "菜品";
}
