#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# upload-audio-cos.sh
# One-time upload of audio_files/ (_en.wav + _cn.wav) to Tencent COS.
# Run this ONCE locally; GitHub Actions will not re-upload audio files.
#
# Prerequisites:
#   pip install coscmd
#   Fill in the four variables below (or export them as env vars).
# ─────────────────────────────────────────────────────────────────

SECRET_ID="${TENCENT_SECRET_ID:-}"
SECRET_KEY="${TENCENT_SECRET_KEY:-}"
BUCKET="${COS_BUCKET:-}"        # e.g. vocab-1234567890
REGION="${COS_REGION:-}"        # e.g. ap-beijing

# ── Validate ──────────────────────────────────────────────────────
if [[ -z "$SECRET_ID" || -z "$SECRET_KEY" || -z "$BUCKET" || -z "$REGION" ]]; then
  echo "ERROR: Set TENCENT_SECRET_ID, TENCENT_SECRET_KEY, COS_BUCKET, COS_REGION"
  echo "  export TENCENT_SECRET_ID=your_id"
  echo "  export TENCENT_SECRET_KEY=your_key"
  echo "  export COS_BUCKET=your-bucket-name"
  echo "  export COS_REGION=ap-beijing   # or ap-shanghai / ap-guangzhou etc."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIO_DIR="$SCRIPT_DIR/../audio_files"

if [[ ! -d "$AUDIO_DIR" ]]; then
  echo "ERROR: audio_files/ directory not found at $AUDIO_DIR"
  exit 1
fi

# ── Configure coscmd ──────────────────────────────────────────────
echo "▶ Configuring coscmd..."
coscmd config -a "$SECRET_ID" -s "$SECRET_KEY" -b "$BUCKET" -r "$REGION"

# ── Count files ───────────────────────────────────────────────────
EN_COUNT=$(find "$AUDIO_DIR" -name '*_en.wav' | wc -l | tr -d ' ')
CN_COUNT=$(find "$AUDIO_DIR" -name '*_cn.wav' | wc -l | tr -d ' ')
echo "▶ Uploading $EN_COUNT _en.wav + $CN_COUNT _cn.wav files to cos://$BUCKET/audio_files/"
echo "  (combined files are excluded — not needed by the app)"
echo "  This may take 10–30 minutes on first run."

# ── Create a temp directory with only _en and _cn files ──────────
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

echo "▶ Copying files to staging area..."
find "$AUDIO_DIR" \( -name '*_en.wav' -o -name '*_cn.wav' \) \
  -exec cp {} "$TMP_DIR/" \;

# ── Upload ────────────────────────────────────────────────────────
echo "▶ Uploading..."
coscmd upload -rs "$TMP_DIR/" /audio_files/

echo ""
echo "✓ Audio upload complete."
echo "  Verify at: https://console.cloud.tencent.com/cos/bucket?bucket=$BUCKET&region=$REGION"
