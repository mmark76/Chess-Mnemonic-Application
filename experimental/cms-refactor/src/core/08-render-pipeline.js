/* Experimental CMS — deterministic render pipeline (no monkey-patch races). */
const CMA_RENDER_PIPELINE = {
  stages: []
};

function renderAllCore() {
  fillSanTable(gameMoves);
  fillAssociationsTable(gameMoves);
  fillPaoTable_0_9(gameMoves);
  fillPaoTable_00_99(gameMoves);
  fillShortnamesTable(gameMoves);
}

function renderAll() {
  let fn = renderAllCore;
  const stages = CMA_RENDER_PIPELINE.stages.slice().reverse();
  stages.forEach(stage => {
    const prev = fn;
    fn = function () {
      if (stage.before) stage.before();
      prev();
      if (stage.after) stage.after();
    };
  });
  fn();
}

CMA_RENDER_PIPELINE.register = function (id, before, after) {
  CMA_RENDER_PIPELINE.stages = CMA_RENDER_PIPELINE.stages.filter(s => s.id !== id);
  CMA_RENDER_PIPELINE.stages.push({ id, before, after });
};
