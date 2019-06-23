const unitDataTemplate = function(body, arm, shld, leg, back, weapon) {
  const unitData = {
    body: body,
    arm: arm,
    shld: shld,
    leg: leg,
    back: back,
    weapon: weapon
  }

  return unitData;
}

const PARTS_ID_LENGTH = 3;

const ALL_PARTS_NUMS = unitDataTemplate(1, 1, 1, 1, 1, 1);

const PARTS_CLASS_LIST = unitDataTemplate({}, {}, {}, {}, {}, {});

const DRAW_HITBOX = true;
