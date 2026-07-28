use std::ffi::{c_char, CString};

use mason_core::{auto, fit_content, flex, length, max_content, min_content, percent, LengthPercentage, LengthPercentageAuto, MinTrackSizingFunction, TrackSizingFunction};

use crate::ffi;
use crate::style::CMasonMinMax;

#[inline]
pub fn get_length_auto_value(value: LengthPercentageAuto) -> (f32, f32) {
    if value.is_auto() {
        return (0.0, 0.0);
    }

    let raw = value.into_raw();

    if raw.is_length_or_percentage() {
        return if raw.uses_percentage() {
            (2., raw.value())
        } else {
            (1., raw.value())
        };
    }

    (-1., 0.)
}

#[inline]
pub fn get_length_value(value: LengthPercentageAuto) -> (f32, f32) {
    let raw = value.into_raw();

    if raw.is_length_or_percentage() {
        return if raw.uses_percentage() {
            (2., raw.value())
        } else {
            (1., raw.value())
        };
    }

    (-1., 0.)
}

#[no_mangle]
pub extern "C" fn mason_util_create_track_sizing_function_with_type_value(
    track_type: i32,
    track_value: f32,
) -> CMasonMinMax {
    // `track_type` comes straight from the caller and the workspace builds with
    // `panic = "abort"`, so an unrecognized value falls back to `auto` rather
    // than killing the process.
    let track_value = if track_value.is_nan() { 0.0 } else { track_value };
    let value: TrackSizingFunction = match track_type {
        1 => min_content(),
        2 => max_content(),
        3 => length(track_value),
        4 => percent(track_value),
        5 => flex(track_value),
        6 => fit_content(LengthPercentage::length(track_value)),
        7 => fit_content(LengthPercentage::percent(track_value)),
        _ => auto(),
    };

    value.into()
}


#[no_mangle]
pub extern "C" fn mason_util_destroy_string(string: *mut c_char) {
    if string.is_null() {
        return;
    }
    let _ = unsafe { CString::from_raw(string) };
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Values arrive from the caller and the workspace builds with
    /// `panic = "abort"`, so an unrecognized track type must degrade to `auto`
    /// rather than kill the process.
    #[test]
    fn unknown_track_type_falls_back_to_auto() {
        let expected = mason_util_create_track_sizing_function_with_type_value(0, 0.0);

        for track_type in [-1, 8, 42, i32::MIN, i32::MAX] {
            let got = mason_util_create_track_sizing_function_with_type_value(track_type, 10.0);
            assert_eq!(got, expected, "track_type {track_type} should decode as auto");
        }
    }

    #[test]
    fn known_track_types_are_unchanged() {
        let min_content = mason_util_create_track_sizing_function_with_type_value(1, 0.0);
        assert_eq!(min_content.min_type, 1);

        let length = mason_util_create_track_sizing_function_with_type_value(3, 12.0);
        assert_eq!(length.max_type, 3);
        assert_eq!(length.max_value, 12.0);

        let fr = mason_util_create_track_sizing_function_with_type_value(5, 2.0);
        assert_eq!(fr.max_type, 5);
        assert_eq!(fr.max_value, 2.0);

        let fit_percent = mason_util_create_track_sizing_function_with_type_value(7, 0.5);
        assert_eq!(fit_percent.max_type, 7);
    }

    #[test]
    fn nan_track_values_are_clamped() {
        let got = mason_util_create_track_sizing_function_with_type_value(3, f32::NAN);
        assert_eq!(got.max_value, 0.0);
        assert!(!got.max_value.is_nan());
    }
}
