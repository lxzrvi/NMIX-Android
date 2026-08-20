const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(
  process.cwd(),
  'assets',
  'sfx'
);

fs.mkdirSync(
  OUTPUT,
  {
    recursive: true
  }
);

const SAMPLE_RATE = 44100;

function generateWav(
  filename,
  {
    duration = 0.1,
    frequencies = [600],
    volume = 0.22,
    attack = 0.005,
    release = 0.05,
    type = 'sine'
  }
) {
  const samples =
    Math.floor(
      SAMPLE_RATE *
      duration
    );

  const data =
    Buffer.alloc(
      samples * 2
    );

  for (
    let i = 0;
    i < samples;
    i++
  ) {
    const time =
      i /
      SAMPLE_RATE;

    let envelope = 1;

    if (
      time < attack
    ) {
      envelope =
        time /
        attack;
    }

    const remaining =
      duration -
      time;

    if (
      remaining <
      release
    ) {
      envelope *=
        Math.max(
          0,
          remaining /
          release
        );
    }

    let signal = 0;

    frequencies.forEach(
      (
        frequency,
        index
      ) => {
        const phase =
          Math.sin(
            2 *
            Math.PI *
            frequency *
            time
          );

        if (
          type ===
          'softSquare'
        ) {
          signal +=
            Math.tanh(
              phase * 1.8
            ) /
            frequencies.length;
        } else {
          signal +=
            phase /
            frequencies.length;
        }
      }
    );

    /*
     * Tiny downward volume curve keeps
     * UI sounds soft instead of harsh.
     */
    const curve =
      Math.pow(
        1 -
        i /
        samples,
        0.55
      );

    const sample =
      Math.max(
        -1,
        Math.min(
          1,
          signal *
          envelope *
          curve *
          volume
        )
      );

    data.writeInt16LE(
      Math.round(
        sample *
        32767
      ),
      i * 2
    );
  }

  writeWav(
    path.join(
      OUTPUT,
      filename
    ),
    data,
    SAMPLE_RATE
  );
}

function generateAlarm() {
  const duration = 1.25;

  const samples =
    Math.floor(
      SAMPLE_RATE *
      duration
    );

  const data =
    Buffer.alloc(
      samples * 2
    );

  const beeps = [
    [0.00, 0.18],
    [0.32, 0.50],
    [0.64, 0.82]
  ];

  for (
    let i = 0;
    i < samples;
    i++
  ) {
    const time =
      i /
      SAMPLE_RATE;

    let active = false;
    let local = 0;

    for (
      const [
        start,
        end
      ] of beeps
    ) {
      if (
        time >= start &&
        time <= end
      ) {
        active = true;
        local =
          time -
          start;
        break;
      }
    }

    let sample = 0;

    if (active) {
      const envelope =
        Math.min(
          1,
          local /
          0.012
        );

      const wave =
        (
          Math.sin(
            2 *
            Math.PI *
            880 *
            time
          ) +
          0.32 *
          Math.sin(
            2 *
            Math.PI *
            1320 *
            time
          )
        ) /
        1.32;

      sample =
        wave *
        envelope *
        0.30;
    }

    data.writeInt16LE(
      Math.round(
        Math.max(
          -1,
          Math.min(
            1,
            sample
          )
        ) *
        32767
      ),
      i * 2
    );
  }

  writeWav(
    path.join(
      OUTPUT,
      'timer-alarm.wav'
    ),
    data,
    SAMPLE_RATE
  );
}

function writeWav(
  filename,
  pcm,
  sampleRate
) {
  const header =
    Buffer.alloc(44);

  const channels = 1;
  const bits = 16;

  header.write(
    'RIFF',
    0
  );

  header.writeUInt32LE(
    36 +
    pcm.length,
    4
  );

  header.write(
    'WAVE',
    8
  );

  header.write(
    'fmt ',
    12
  );

  header.writeUInt32LE(
    16,
    16
  );

  header.writeUInt16LE(
    1,
    20
  );

  header.writeUInt16LE(
    channels,
    22
  );

  header.writeUInt32LE(
    sampleRate,
    24
  );

  header.writeUInt32LE(
    sampleRate *
    channels *
    bits /
    8,
    28
  );

  header.writeUInt16LE(
    channels *
    bits /
    8,
    32
  );

  header.writeUInt16LE(
    bits,
    34
  );

  header.write(
    'data',
    36
  );

  header.writeUInt32LE(
    pcm.length,
    40
  );

  fs.writeFileSync(
    filename,
    Buffer.concat([
      header,
      pcm
    ])
  );
}

/*
 * Soft global tap.
 */
generateWav(
  'tap.wav',
  {
    duration: 0.065,
    frequencies: [
      620,
      840
    ],
    volume: 0.16,
    release: 0.045
  }
);

/*
 * Accordion open.
 */
generateWav(
  'open.wav',
  {
    duration: 0.16,
    frequencies: [
      480,
      720,
      960
    ],
    volume: 0.14,
    release: 0.08
  }
);

/*
 * Slightly lower close response.
 */
generateWav(
  'close.wav',
  {
    duration: 0.14,
    frequencies: [
      390,
      585
    ],
    volume: 0.14,
    release: 0.075
  }
);

/*
 * Carousel/theme/font selection tick.
 */
generateWav(
  'select.wav',
  {
    duration: 0.08,
    frequencies: [
      760,
      1140
    ],
    volume: 0.17,
    release: 0.05
  }
);

/*
 * Calculator result confirmation.
 */
generateWav(
  'result.wav',
  {
    duration: 0.18,
    frequencies: [
      520,
      780,
      1040
    ],
    volume: 0.16,
    release: 0.10
  }
);

generateAlarm();

console.log(
  'NMIX SFX generated in assets/sfx/'
);
