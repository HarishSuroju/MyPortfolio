export const newId = () =>
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// Items saved before the admin existed may not have an id; give them one so
// lists can be reordered and edited reliably.
export const ensureIds = (list = []) =>
    list.map((item) => (item.id != null ? item : { ...item, id: newId() }));
