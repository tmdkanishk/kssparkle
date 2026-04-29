import { useWindowDimensions } from 'react-native'
import {
  Canvas,
  Image,
  useImage,
  BackdropBlur,
  RoundedRect,
  Fill,
  LinearGradient,
  vec,
  Group,
  Paint,
  BlurMask,
} from '@shopify/react-native-skia'

const CARD = { x: 30, y: 200, w: 320, h: 180, r: 24 }

export default function SkiaGlassCard() {
  const bg = useImage(require('../../assets/images/backgroundimage.png'))
  const { width, height } = useWindowDimensions()

  if (!bg) return null

  return (
    <Canvas style={{ width, height }}>
      {/* Background image */}
      {/* <Image image={bg} x={0} y={0} width={width} height={height} fit="cover" /> */}

      {/* Glass card — BackdropBlur clips to the rounded rect */}
      <BackdropBlur
        blur={18}
        clip={{ x: CARD.x, y: CARD.y, width: CARD.w, height: CARD.h, rx: CARD.r }}
      >
        {/* Frosted tint layer */}
        <RoundedRect
          x={CARD.x} y={CARD.y}
          width={CARD.w} height={CARD.h}
          r={CARD.r}
          color="rgba(255, 255, 255, 0.15)"
        />

        {/* Top shine gradient — the "glass glare" */}
        <RoundedRect
          x={CARD.x} y={CARD.y}
          width={CARD.w} height={CARD.h / 2}
          r={CARD.r}
          color="transparent"
        >
          <LinearGradient
            start={vec(CARD.x, CARD.y)}
            end={vec(CARD.x, CARD.y + CARD.h / 2)}
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
          />
        </RoundedRect>
      </BackdropBlur>

      {/* Border ring — drawn on top */}
      <RoundedRect
        x={CARD.x} y={CARD.y}
        width={CARD.w} height={CARD.h}
        r={CARD.r}
        color="transparent"
        style="stroke"
        strokeWidth={1}
      >
        <LinearGradient
          start={vec(CARD.x, CARD.y)}
          end={vec(CARD.x + CARD.w, CARD.y + CARD.h)}
          colors={[
            'rgba(255,255,255,0.7)',
            'rgba(255,255,255,0.1)',
            'rgba(255,255,255,0.4)',
          ]}
        />
      </RoundedRect>
    </Canvas>
  )
}