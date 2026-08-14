import { readFile, writeFile } from 'node:fs/promises'

const contentBySlug = {
  'baseball-9': {
    overview: 'Baseball 9 puts you in the batter\'s box for a streamlined baseball challenge built around timing, pitch recognition, and clean contact. Each at-bat asks you to judge the incoming ball before committing to a swing, so patience matters as much as reaction speed. The short browser sessions make it easy to chase a better score without working through a long season mode.',
    gameplay: 'Watch the pitcher\'s release, track the ball into the hitting zone, and swing when it reaches the best contact point. Well-timed hits travel farther and create better scoring chances, while early or late swings are easier to miss. The challenge increases as pitch speed and placement become less predictable.',
    howToPlay: 'Select play and wait for the pitcher to begin the delivery. Keep your pointer or finger ready, then swing only when the ball enters the hitting area. Avoid tapping at every pitch: read its height and speed first. Build runs by making consistent contact, and use each missed swing to adjust your timing for the next delivery.',
    controls: [{ action: 'Swing the bat', input: 'Click, tap, or the on-screen swing control' }, { action: 'Choose an option', input: 'Click or tap' }],
    mobileTips: 'Use landscape mode when available and tap with your dominant thumb without covering the pitcher\'s release point.',
    desktopTips: 'Keep the cursor near the center of the game and use a short click instead of moving the pointer during the pitch.',
    similarGames: ['baseball-bros', 'super-baseball', 'doodle-baseball', 'backyard-baseball', 'baseball-bros-io'],
  },
  'wacky-flip': {
    overview: 'Wacky Flip is a stunt game about launching a ragdoll athlete, rotating in the air, and landing upright on a marked platform. The controls are deliberately compact, but every jump changes with the launch angle and the length of time you hold the flip. Success comes from balancing ambitious tricks against a controlled landing.',
    gameplay: 'Charge a jump, release to launch, and control rotation while the character is airborne. Extra flips can improve a run, but they also leave less time to straighten the body before contact. Later stages use awkward heights and smaller landing zones that demand more precise release timing.',
    howToPlay: 'Press and hold to prepare the jump, then release to launch from the platform. Hold again in the air to rotate and let go early enough to bring the character upright. Aim to land feet-first inside the target area. Start with a single rotation, learn the speed of the flip, and add more rotations only when the landing remains reliable.',
    controls: [{ action: 'Charge and jump', input: 'Press, hold, then release' }, { action: 'Rotate in the air', input: 'Press and hold while airborne' }],
    similarGames: ['vex-9', 'hexa-stack', 'speed-stars'],
  },
  'vex-9': {
    overview: 'Vex 9 is a precision platform game filled with spikes, moving hazards, narrow ledges, and parkour-style obstacle courses. Each act is a compact test of movement and route reading. Checkpoints limit repetition after a mistake, while optional challenges reward players who can move quickly without losing control.',
    gameplay: 'Run, jump, slide, wall-jump, and swim through obstacle sequences where momentum affects the next move. Hazards reset the character to the latest checkpoint. The safest route is not always the fastest, so time-focused runs require different decisions from a first completion attempt.',
    howToPlay: 'Use the movement keys to approach each obstacle and jump before reaching its edge. Slide under low hazards, use walls to gain height, and pause at checkpoints to read the next pattern. On a first run, prioritize reaching every checkpoint. Once the route is familiar, connect movements smoothly and reduce unnecessary stops.',
    controls: [{ action: 'Move', input: 'WASD or arrow keys' }, { action: 'Jump or climb', input: 'Up arrow or W' }, { action: 'Slide or crouch', input: 'Down arrow or S' }],
    similarGames: ['wacky-flip', 'sprint-league', 'speed-stars', 'superbrawl-io'],
  },
  'basket-random': {
    overview: 'Basket Random turns a basketball match into a physics-driven two-player contest where the court, players, ball, and hoop can change after every point. Each side uses a single action, so the comedy comes from unpredictable jumps and collisions rather than complex button combinations. The first team to reach the winning score takes the match.',
    gameplay: 'Trigger both players on your team to jump and swing their arms toward the ball. A point immediately loads a new randomized round, forcing both sides to adapt to different bodies, surfaces, and ball behavior. Positioning and the timing of each jump matter more than repeated button presses.',
    howToPlay: 'Choose one-player or local two-player mode. Press your assigned key to make the team jump, block, or shoot, depending on where the ball is located. Wait for the ball to approach before acting so your players meet it with useful momentum. In two-player mode, protect your hoop after every reset because the opening bounce can create a quick score.',
    controls: [{ action: 'Player 1 action', input: 'W' }, { action: 'Player 2 action', input: 'Up arrow' }, { action: 'Mobile action', input: 'Tap the on-screen side' }],
    similarGames: ['basketball-stars', 'basketball-master-2', 'dunk-dash', 'baseball-bros'],
  },
  'hexa-stack': {
    overview: 'Hexa Stack is a spatial puzzle built around placing hexagonal pieces and combining matching colors. Every placement changes the available space, so a move that scores immediately can also block a stronger chain later. The relaxed pace gives you time to compare positions before committing a piece.',
    gameplay: 'Drag each offered hex piece onto an open cell. Adjacent matching colors can merge or clear according to the current puzzle state, opening room for later pieces. A run ends when the remaining shapes no longer fit, making board management more important than chasing one large combo.',
    howToPlay: 'Inspect all available pieces before placing the first one. Drag a piece to an open hex cell and group matching colors where they can connect without sealing off isolated gaps. Keep several flexible spaces near the center of the board. When the layout becomes crowded, prioritize moves that clear space over moves that only add points.',
    controls: [{ action: 'Select a piece', input: 'Click or touch and hold' }, { action: 'Place a piece', input: 'Drag and release on an open cell' }],
    similarGames: ['block-blast', 'block-blaster-puzzle', 'wacky-flip'],
  },
  'curve-rush-io': {
    overview: 'Curve Rush IO is a fast racing challenge centered on following curved tracks, carrying speed through bends, and avoiding sudden collisions. The route rewards smooth steering more than constant correction. Multiplayer-style competition adds pressure as nearby racers fight for the same safe line.',
    gameplay: 'Guide the racer along a winding course and adjust direction before each curve tightens. Entering a turn too sharply costs momentum or sends you into an obstacle, while a controlled arc preserves speed. Surviving longer sections creates better opportunities to pass competitors.',
    howToPlay: 'Start moving and look ahead to the next two bends instead of reacting only to the space directly in front of you. Steer gradually into wide curves and make smaller corrections when the course narrows. Avoid crowding another racer at an obstacle, and choose a clear route even when it is slightly longer.',
    controls: [{ action: 'Steer', input: 'Mouse movement, arrow keys, or on-screen control' }, { action: 'Confirm menu choices', input: 'Click or tap' }],
    similarGames: ['sprint-league', 'speed-stars', 'superbrawl-io'],
  },
  'superbrawl-io': {
    overview: 'SuperBrawl.io is an arena fighting game where players trade quick attacks, avoid incoming damage, and compete for control of limited space. Short rounds keep the action moving, while different opponents force you to change the distance and timing of your attacks. Staying alive is often more valuable than chasing one risky knockout.',
    gameplay: 'Move around the arena, approach from a useful angle, and attack when an opponent is committed or exposed. Repeatedly charging into the center makes you an easy target. Better runs combine short engagements with quick retreats so you can reset before the next exchange.',
    howToPlay: 'Enter a match and learn the movement and attack buttons shown by the game. Circle the edge of a fight before committing, then strike when an opponent misses or turns away. Keep enough room behind your character to escape. Against several rivals, avoid standing between them and let their attacks create openings.',
    controls: [{ action: 'Move', input: 'WASD, arrow keys, or virtual joystick' }, { action: 'Attack or use ability', input: 'Mouse button, keyboard prompt, or on-screen button' }],
    similarGames: ['curve-rush-io', 'baseball-bros-io', 'vex-9'],
  },
  'growden-io': {
    overview: 'Growden.io combines farming, building, and incremental strategy in a shared online-style world. You begin with limited resources, plant or collect useful items, and reinvest the return into a larger and more efficient plot. Progress comes from choosing upgrades that improve production instead of spending everything on decoration.',
    gameplay: 'Gather resources, develop the available land, and expand production in small cycles. Each upgrade changes how quickly the next purchase becomes affordable. Other players or changing conditions can influence the best route, so leaving room to adapt is part of the strategy.',
    howToPlay: 'Follow the opening prompts to claim your first resources and place an initial crop or structure. Collect the output when it is ready, then spend earnings on capacity, speed, or new production options. Expand in a compact pattern so important areas remain easy to reach, and keep a reserve for upgrades that unlock better returns.',
    controls: [{ action: 'Move or navigate', input: 'WASD, arrow keys, or virtual joystick' }, { action: 'Interact, build, or collect', input: 'Click, tap, or the prompted action key' }],
    similarGames: ['curve-rush-io', 'superbrawl-io', 'hexa-stack'],
  },
  'sprint-league': {
    overview: 'Sprint League is a running competition focused on acceleration, rhythm, and maintaining speed to the finish. Races are short enough for quick retries, but small timing errors compound over the length of the track. A clean start and steady input pattern usually beat frantic tapping.',
    gameplay: 'Build speed from the starting signal and keep the runner\'s rhythm balanced through the race. Poorly timed inputs interrupt the stride and allow rivals to pull ahead. Later events demand quicker reactions and more consistent pacing.',
    howToPlay: 'Wait for the start signal, then use the prompted running controls in a steady alternating rhythm. Focus on even timing instead of maximum tapping speed. If the runner loses balance, slow the rhythm briefly and rebuild it. Watch the finish line and maintain form rather than changing your input in the final steps.',
    controls: [{ action: 'Run', input: 'Alternate the displayed keys or tap controls' }, { action: 'Start or retry', input: 'Click or tap' }],
    similarGames: ['speed-stars', 'curve-rush-io', 'vex-9'],
  },
  'speed-stars': {
    overview: 'Speed Stars is a track sprint simulator that turns each stride into a timing decision. Alternating inputs control the runner\'s legs, and the fastest results come from a stable cadence rather than uncontrolled button mashing. Personal-best chasing gives every race a clear target.',
    gameplay: 'React to the start and alternate the running inputs to accelerate. The runner\'s posture and speed reveal whether your cadence is balanced. Inconsistent timing causes stumbles or shorter strides, while an even rhythm maintains top speed through the finish.',
    howToPlay: 'Begin after the starting cue and alternate the left and right running controls. Establish a manageable rhythm during the first steps, then increase it without letting both inputs overlap. Use the runner\'s animation as feedback: if the stride becomes uneven, correct the timing before trying to accelerate again.',
    controls: [{ action: 'Left stride', input: 'Left running key or left tap area' }, { action: 'Right stride', input: 'Right running key or right tap area' }],
    similarGames: ['sprint-league', 'curve-rush-io', 'wacky-flip'],
  },
  'block-blaster-puzzle': {
    overview: 'Block Blaster Puzzle is a board-clearing game where you place block shapes to complete rows, columns, or matching groups. There is no need to rush, but every piece must fit somewhere on the current board. Planning space for awkward shapes is the key to extending a run.',
    gameplay: 'Choose from the available block pieces and place them on empty cells. Completed patterns clear from the board and create room for the next set. Combos reward consecutive clears, while isolated empty cells become difficult to use later.',
    howToPlay: 'Review every offered piece before making a placement. Drag a shape onto empty cells, aiming to complete a line while preserving at least one large open area. Place restrictive or oversized shapes first when possible. Avoid creating single-cell holes unless another available piece can fill them immediately.',
    controls: [{ action: 'Select a block', input: 'Click or touch and hold' }, { action: 'Place a block', input: 'Drag and release on the board' }],
    similarGames: ['block-blast', 'hexa-stack'],
  },
  'block-blast': {
    overview: 'Block Blast is a relaxed grid puzzle about fitting shapes, completing lines, and protecting usable space. The game presents a small set of pieces at a time, letting you plan their order before placement. Scores grow through efficient clears and combos, but a run ends as soon as none of the available shapes fit.',
    gameplay: 'Drag blocks onto the board to fill complete horizontal or vertical lines. Cleared lines free their cells and can trigger higher-scoring sequences. Because pieces cannot be rotated in many versions, keeping broad open zones is essential for large shapes.',
    howToPlay: 'Check the size of all three available pieces and decide which one has the fewest safe positions. Place blocks to finish rows or columns, then use the cleared space for the remaining shapes. Build near existing groups instead of scattering pieces, and keep corners from becoming isolated pockets.',
    controls: [{ action: 'Pick up a block', input: 'Click or touch and hold' }, { action: 'Place a block', input: 'Drag and release on empty cells' }],
    similarGames: ['block-blaster-puzzle', 'hexa-stack'],
  },
  'retro-bowl-college': {
    overview: 'Retro Bowl College adapts the pixel-football formula to the college game, combining on-field passing with roster and program decisions. You guide an offense during matches while managing the players and choices that shape a season. The simple presentation hides meaningful tradeoffs between short-term wins and long-term development.',
    gameplay: 'On offense, select a receiver, aim the pass, and release with the right power and lead. Runs and short throws reduce risk, while deep passes can change a drive quickly. Between games, roster condition and management choices affect how reliably the team performs.',
    howToPlay: 'Read the defensive alignment before the snap and choose a route with space ahead of it. Drag to aim a pass, lead moving receivers, and avoid throwing across a defender\'s path. Use shorter gains to keep drives alive. Outside matches, monitor player condition and spend limited resources where they improve the full lineup.',
    controls: [{ action: 'Aim and throw', input: 'Click or touch, drag backward, then release' }, { action: 'Move the ball carrier', input: 'Swipe or drag after possession' }],
    similarGames: ['retro-bowl', 'football-kickoff', 'baseball-9'],
  },
  'retro-bowl': {
    overview: 'Retro Bowl blends arcade passing with team management in a compact pixel-football season. You control the offense on game day and make roster, staff, and upgrade decisions between fixtures. Winning consistently requires both accurate throws and a team that can stay healthy and effective over time.',
    gameplay: 'Aim passes to receivers as their routes develop, choose safer short gains or higher-risk deep throws, and guide runners away from defenders. Management screens let you improve personnel and facilities. Poor decisions off the field can make even well-played drives harder to finish.',
    howToPlay: 'Before the snap, identify which receiver has the clearest route. Drag backward from the quarterback to set direction and power, then release to throw ahead of the target. Use lateral movement to avoid tackles after a catch. Between matches, balance roster upgrades with morale, stamina, and long-term team needs.',
    controls: [{ action: 'Aim and throw', input: 'Click or touch, drag backward, then release' }, { action: 'Dodge while running', input: 'Swipe or drag after the catch' }],
    similarGames: ['retro-bowl-college', 'football-kickoff', 'baseball-9'],
  },
  'baseball-bros-io': {
    overview: 'Baseball Bros IO is a quick multiplayer-style baseball game with exaggerated movement, fast innings, and direct competition. Batting, pitching, and fielding happen with minimal downtime, making positioning and immediate reactions more important than a complex rule set. It is designed for short, energetic matches.',
    gameplay: 'Time swings to drive the ball into open space, then run the bases while the fielding side retrieves and throws it. On defense, reach the ball quickly and send it toward the most useful base. Each play can shift momentum because mistakes often create extra bases.',
    howToPlay: 'Choose a match and use the movement controls to position your player. At bat, wait for the pitch and swing near the plate rather than pressing early. After contact, advance only while the ball remains difficult to field. On defense, take the shortest line to the ball and throw ahead of the runner.',
    controls: [{ action: 'Move', input: 'WASD, arrow keys, or virtual joystick' }, { action: 'Swing, pitch, or throw', input: 'Space, action key, or on-screen button' }],
    similarGames: ['baseball-bros', 'baseball-9', 'super-baseball', 'basket-random'],
  },
  'football-kickoff': {
    overview: 'Football Kickoff is an accuracy challenge about sending the ball through the uprights while accounting for distance and changing wind. The kicking motion is easy to understand, but consistent scores depend on reading conditions before every attempt. Each successful kick raises the pressure for the next one.',
    gameplay: 'Set the direction and power of a kick, then watch how wind and distance alter the flight. Centered kicks provide the safest margin, while extreme conditions require deliberate compensation. A missed attempt ends or reduces the current scoring run, depending on the mode.',
    howToPlay: 'Check the wind indicator and the position of the goalposts before starting the kick. Swipe or drag through the ball toward your intended target, adjusting slightly against the wind. Use a straight, controlled gesture for close attempts. At longer range, add power without sacrificing the direction of the swipe.',
    controls: [{ action: 'Aim and kick', input: 'Swipe or click-drag through the ball' }, { action: 'Continue or retry', input: 'Click or tap' }],
    similarGames: ['retro-bowl', 'retro-bowl-college', 'golf-hit'],
  },
  'basketball-stars': {
    overview: 'Basketball Stars is a one-on-one basketball game built around dribbling, shooting, blocking, and local two-player competition. Matches move quickly between offense and defense, so reading an opponent is as important as hitting the shot meter. Special abilities can create a lead, but good spacing remains the foundation.',
    gameplay: 'Move into shooting range, protect the ball, and release shots with enough separation from the defender. On defense, stay between the opponent and the hoop and time blocks near the release. Modes include solo challenges and head-to-head play on one device.',
    howToPlay: 'Select a mode and learn the movement, shoot, and steal or block keys shown on screen. Create space before shooting instead of releasing directly into a defender. When defending, mirror the opponent and save the jump for the actual shot. In two-player games, vary drive and shot timing to avoid becoming predictable.',
    controls: [{ action: 'Move', input: 'WASD or arrow keys' }, { action: 'Shoot or steal', input: 'B or L' }, { action: 'Pump or block', input: 'S or down arrow' }],
    similarGames: ['basket-random', 'basketball-master-2', 'dunk-dash', 'baseball-bros'],
  },
  'golf-hit': {
    overview: 'Golf Hit is a distance-focused golf game where one well-timed swing can send the ball through surprising environments. Rather than playing a full traditional course, the goal is to maximize carry, bounce, and total distance. Upgrades and clean timing help each attempt travel farther than the last.',
    gameplay: 'Start the swing and stop or release the power indicator near its ideal point. The launch angle and timing determine the opening flight, while terrain and objects affect later bounces. Earnings from a run can improve power or other attributes for future attempts.',
    howToPlay: 'Watch the swing or power meter and click or tap at the strongest controllable point. Aim for consistent contact before chasing maximum power. Observe where the ball loses distance, then use earned upgrades to address that limitation. A slightly lower launch may perform better when it produces useful forward bounces.',
    controls: [{ action: 'Set swing timing', input: 'Click or tap' }, { action: 'Choose upgrades', input: 'Click or tap the upgrade option' }],
    similarGames: ['football-kickoff', 'pool-8-ball-mania', 'baseball-9'],
  },
  'pool-8-ball-mania': {
    overview: 'Pool 8 Ball Mania recreates a compact game of eight-ball pool with aiming lines, adjustable shot power, and turn-based table strategy. Potting a ball is only part of the challenge: the cue ball should also finish where it sets up the next shot. Careless power can turn an easy table into a difficult one.',
    gameplay: 'Aim the cue, set shot strength, and strike the cue ball to pocket the correct group of balls before the eight ball. Cushion angles and cue-ball position determine what is available next. Fouls or premature contact with the eight ball can hand control to the opponent.',
    howToPlay: 'Drag the aim line toward your target ball and check the predicted contact direction. Set only enough power to reach the pocket while keeping the cue ball under control. Clear easier balls first when they open paths to blocked shots. Attempt the eight ball only after your assigned group has been removed.',
    controls: [{ action: 'Aim the cue', input: 'Move the mouse or drag on the table' }, { action: 'Set power and shoot', input: 'Drag the power control, then release' }],
    similarGames: ['golf-hit', 'football-kickoff', 'basketball-master-2'],
  },
  'basketball-master-2': {
    overview: 'Basketball Master 2 is a shot-planning puzzle where obstacles, defenders, and unusual angles stand between the ball and the hoop. Every level asks for a specific line rather than rapid-fire shooting. Bank shots and controlled rebounds often solve layouts that have no direct path.',
    gameplay: 'Aim the basketball, set its direction and strength, and release to attempt the shot. Static or moving obstacles alter the available route. Limited attempts encourage you to study a miss and adjust the next trajectory instead of repeating the same input.',
    howToPlay: 'Drag from the ball to preview the shot direction, then release when the line points toward a clear route. Use walls or backboards when an obstacle blocks the hoop. Make small adjustments after a miss because large changes can hide whether angle or power caused the problem. Prefer repeatable bank shots over low-margin direct attempts.',
    controls: [{ action: 'Aim and set power', input: 'Click or touch, drag, then release' }, { action: 'Restart a level', input: 'Use the on-screen restart control' }],
    similarGames: ['basketball-stars', 'basket-random', 'dunk-dash', 'pool-8-ball-mania'],
  },
  'baseball-bros': {
    overview: 'Baseball Bros delivers an arcade baseball matchup designed for quick play and head-to-head moments. Oversized swings, rapid base running, and simple fielding keep the focus on timing and competition. The compact controls also make it a natural choice for local two-player sessions.',
    gameplay: 'At bat, line up with the pitch and swing late enough to make strong contact. Runners advance while the defense chases the ball and throws toward a base. On defense, positioning before the hit reduces the distance needed to stop an extra-base play.',
    howToPlay: 'Choose a solo or two-player match and use the assigned movement controls to position each player. Wait until the pitch reaches the hitting zone before swinging. Run aggressively on a deep hit, but return when a fielder gains control. When fielding, throw to the base the lead runner is approaching rather than following the ball.',
    controls: [{ action: 'Move', input: 'WASD or arrow keys' }, { action: 'Swing, pitch, or throw', input: 'G or L, depending on player side' }],
    similarGames: ['baseball-bros-io', 'baseball-9', 'super-baseball', 'basket-random'],
  },
  'dunk-dash': {
    overview: 'Dunk Dash combines a forward running course with basketball finishes, asking you to dodge hazards, collect advantages, and arrive at the rim with enough momentum to score. The route is often more important than raw speed. A clean approach creates a much easier final dunk.',
    gameplay: 'Guide the runner along the course, avoid obstacles, and move through useful gates or pickups. The choices made before the basket affect the strength or style of the finish. Collisions slow progress and can prevent a successful dunk.',
    howToPlay: 'Swipe, drag, or steer to move between lanes as the player runs forward. Look beyond the nearest obstacle and line up early for gates that improve the final attempt. Avoid sharp last-second movements, which can cause a collision. At the basket, follow the displayed prompt to complete the dunk.',
    controls: [{ action: 'Steer between lanes', input: 'Drag, swipe, or use arrow controls' }, { action: 'Finish the dunk', input: 'Follow the on-screen tap or release prompt' }],
    similarGames: ['basketball-stars', 'basketball-master-2', 'basket-random', 'sprint-league'],
  },
  'backyard-baseball': {
    overview: 'Backyard Baseball is a colorful youth baseball game with team selection, batting, pitching, fielding, and a full retro presentation. The browser version preserves the slower tactical pace of a console-era sports title. Players who enjoy lineup choices and complete innings will find more depth here than in a single-swing challenge.',
    gameplay: 'Build or select a team, then play both offense and defense across an inning-based match. Batting requires pitch timing and placement, while fielding asks you to move to the ball and choose the right base. Pitch selection and defensive positioning shape each at-bat.',
    howToPlay: 'Use the emulator controls shown around the game to navigate menus and select players. At bat, choose a swing and time the action button as the pitch crosses the plate. On defense, move the active fielder toward the ball and throw to the base that can stop the lead runner. Save progress through the game\'s available menu when supported.',
    controls: [{ action: 'Move or choose a menu item', input: 'Arrow keys or directional pad' }, { action: 'Confirm, swing, pitch, or throw', input: 'Mapped A/B buttons shown by the emulator' }, { action: 'Start or pause', input: 'Mapped Start button' }],
    similarGames: ['baseball-9', 'baseball-bros', 'super-baseball', 'doodle-baseball'],
  },
  'super-baseball': {
    overview: 'Super Baseball is an arcade batting game that strips baseball down to pitch reading, swing timing, and home-run distance. Attempts begin quickly, making it easy to compare one swing with the next. Different pitch paths reward players who wait for the ball instead of relying on a fixed rhythm.',
    gameplay: 'Track the pitch as it approaches the plate and trigger the swing at the strongest contact point. Timing affects both direction and distance. Consecutive hits build the score, while misses break momentum and expose which pitch types need more practice.',
    howToPlay: 'Keep your attention on the pitcher or release point and wait for the ball to travel into the hitting zone. Click or tap once to swing. Use the result to calibrate the next attempt: a weak or opposite-field hit usually means the timing was early or late. Do not swing at a fixed interval because pitch speed can vary.',
    controls: [{ action: 'Swing the bat', input: 'Click, tap, or the on-screen action button' }, { action: 'Select or retry', input: 'Click or tap' }],
    similarGames: ['baseball-9', 'baseball-bros', 'doodle-baseball', 'baseball-bros-io'],
  },
  'doodle-baseball': {
    overview: 'Doodle Baseball is a light one-button batting game featuring playful food characters and a hand-drawn ballpark. Each pitch is a compact timing test, and successful contact keeps the inning moving. The approachable format suits quick sessions while still giving score chasers a reason to improve pitch recognition.',
    gameplay: 'Watch the pitcher, follow the ball toward the plate, and swing with a single input. Contact quality determines whether the result is a short hit, a strong drive, or a home run. Strikes accumulate when the timing misses the ball, so preserving the inning requires patience.',
    howToPlay: 'Wait for the pitcher to release the ball and track its speed into the hitting area. Click or tap when the ball reaches the plate. Faster pitches need an earlier response, while slower pitches punish guessing. Focus on making reliable contact first; home runs follow naturally when the timing reaches the center of the swing window.',
    controls: [{ action: 'Swing the bat', input: 'Click, tap, or press the displayed action key' }, { action: 'Start or replay', input: 'Click or tap' }],
    similarGames: ['baseball-9', 'super-baseball', 'baseball-bros', 'backyard-baseball'],
  },
}

const dataPath = new URL('../src/data/games.json', import.meta.url)
const games = JSON.parse(await readFile(dataPath, 'utf8'))

for (const game of games) {
  const content = contentBySlug[game.slug]
  if (!content) throw new Error(`Missing enrichment content for ${game.slug}`)
  Object.assign(game.seoContent, content)
  const gameplaySentences = content.gameplay.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) || []
  const howToSentences = content.howToPlay.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) || []
  const tips = [...howToSentences, ...gameplaySentences].slice(0, 4)
  game.seoContent.features = [
    `${game.categories[0].replace(/-/g, ' ')} focus: ${gameplaySentences[0] || content.gameplay}`,
    `Practical controls: ${content.controls.map((control) => control.action).join(', ')}`,
    `Skill set: Practice ${game.tags.slice(0, 3).map((tag) => tag.replace(/-/g, ' ')).join(', ')}`,
    'Instant browser play: Start a session without installing a separate game client',
  ]
  game.seoContent.tipsAndTricks = tips
  game.seoContent.bestFor = `Players who enjoy ${game.tags.slice(0, 3).map((tag) => tag.replace(/-/g, ' ')).join(', ')}`
  delete game.seoContent.funFacts
  delete game.seoContent.comments
}

await writeFile(dataPath, `${JSON.stringify(games, null, 2)}\n`)
console.log(`Enriched ${games.length} games`)
