#!/bin/sh

echo "Set exit on simple errors"
set -e

rm -rf $(PWD)/dist


echo "Build for iphonesimulator"
xcodebuild \
    -project Mason/Mason.xcodeproj \
    -scheme Mason \
    -sdk iphonesimulator \
    -destination "generic/platform=iOS Simulator" \
    -configuration Release \
    clean build \
    BUILD_DIR=$(PWD)/dist \
    SKIP_INSTALL=NO \
    BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
    -quiet

echo "Build for iphoneos"
xcodebuild \
    -project Mason/Mason.xcodeproj \
    -scheme Mason \
    -sdk iphoneos \
    -destination "generic/platform=iOS" \
    -configuration Release \
    clean build \
    BUILD_DIR=$(PWD)/dist \
    CODE_SIGN_IDENTITY="" \
    CODE_SIGNING_REQUIRED=NO \
    SKIP_INSTALL=NO \
    BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
    -quiet

XR_FRAMEWORK_ARGS=""
# visionOS (xrOS) slices are opt-in: `INCLUDE_VISIONOS=1 ./build.sh`. The Mason
# Xcode target must list `xros xrsimulator` in SUPPORTED_PLATFORMS and set
# XROS_DEPLOYMENT_TARGET, and the Rust visionOS targets build via nightly
# `-Z build-std` (wired in pre-build.sh). Kept opt-in so the default iOS build
# is unaffected until a visionOS toolchain is present.
if [ "${INCLUDE_VISIONOS:-0}" = "1" ]; then
  echo "Build for visionOS simulator"
  xcodebuild \
      -project Mason/Mason.xcodeproj \
      -scheme Mason \
      -sdk xrsimulator \
      -destination "generic/platform=visionOS Simulator" \
      ARCHS=arm64 \
      -configuration Release \
      clean build \
      BUILD_DIR=$(PWD)/dist \
      SKIP_INSTALL=NO \
      BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
      -quiet

  echo "Build for visionOS"
  xcodebuild \
      -project Mason/Mason.xcodeproj \
      -scheme Mason \
      -sdk xros \
      -destination "generic/platform=visionOS" \
      ARCHS=arm64 \
      -configuration Release \
      clean build \
      BUILD_DIR=$(PWD)/dist \
      CODE_SIGN_IDENTITY="" \
      CODE_SIGNING_REQUIRED=NO \
      SKIP_INSTALL=NO \
      BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
      -quiet

  XR_FRAMEWORK_ARGS="-framework $(PWD)/dist/Release-xros/Mason.framework \
    -debug-symbols $(PWD)/dist/Release-xros/Mason.framework.dSYM \
    -framework $(PWD)/dist/Release-xrsimulator/Mason.framework \
    -debug-symbols $(PWD)/dist/Release-xrsimulator/Mason.framework.dSYM"
fi

echo "Creating XCFramework"
xcodebuild \
    -create-xcframework \
    -framework $(PWD)/dist/Release-iphoneos/Mason.framework \
    -debug-symbols $(PWD)/dist/Release-iphoneos/Mason.framework.dSYM \
    -framework $(PWD)/dist/Release-iphonesimulator/Mason.framework \
    -debug-symbols $(PWD)/dist/Release-iphonesimulator/Mason.framework.dSYM \
    $XR_FRAMEWORK_ARGS \
    -output $(PWD)/dist/Mason.xcframework