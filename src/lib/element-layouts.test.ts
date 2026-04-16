import test from "node:test";
import assert from "node:assert/strict";
import { createLayoutEditor } from "./element-layouts";

test("preview layout editor keeps stored element positions readable", () => {
  let selectCalls = 0;
  let commitCalls = 0;
  let saveCalls = 0;

  const layoutEditor = createLayoutEditor({
    props: {
      elementLayouts: {
        "hero-cta": { x: -272, y: 48 },
      },
    },
    editable: false,
    selectedKey: "hero-cta",
    isComponentSelected: true,
    onSelect: () => {
      selectCalls += 1;
    },
    onCommit: () => {
      commitCalls += 1;
    },
    onSave: () => {
      saveCalls += 1;
    },
  });

  assert.equal(layoutEditor.editable, false);
  assert.equal(layoutEditor.selectedKey, null);
  assert.equal(layoutEditor.isComponentSelected, false);
  assert.deepEqual(layoutEditor.getLayout("hero-cta"), { x: -272, y: 48 });

  layoutEditor.selectKey("hero-title");
  layoutEditor.commitLayout("hero-cta", { x: 9, y: 25 });
  layoutEditor.save();

  assert.equal(selectCalls, 0);
  assert.equal(commitCalls, 0);
  assert.equal(saveCalls, 0);
});

test("edit layout editor snaps committed positions before saving", () => {
  let committed:
    | { elementKey: string; position: { x: number; y: number } }
    | undefined;

  const layoutEditor = createLayoutEditor({
    props: {},
    editable: true,
    selectedKey: "hero-cta",
    isComponentSelected: true,
    onSelect: () => undefined,
    onCommit: (elementKey, position) => {
      committed = { elementKey, position };
    },
    onSave: () => undefined,
  });

  layoutEditor.commitLayout("hero-cta", { x: 9, y: 25 });

  assert.deepEqual(committed, {
    elementKey: "hero-cta",
    position: { x: 16, y: 32 },
  });
});
