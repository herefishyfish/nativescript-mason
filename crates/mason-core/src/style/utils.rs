use crate::utils::{
    align_content_from_enum, align_items_from_enum, align_self_from_enum, box_sizing_from_enum,
    direction_from_enum, display_from_enum, flex_direction_from_enum, flex_wrap_from_enum,
    grid_auto_flow_from_enum, justify_content_from_enum, overflow_from_enum, position_from_enum,
    text_align_from_enum,
};
use taffy::geometry::Point;

use crate::style::StyleKeys;
use crate::Style;
use taffy::style::{
    LengthPercentage, LengthPercentageAuto, MinTrackSizingFunction, TrackSizingFunction,
};
use taffy::style_helpers::{
    FromLength, FromPercent, TaffyAuto, TaffyFitContent, TaffyMaxContent, TaffyMinContent,
};
use taffy::{CompactLength, Dimension, MaxTrackSizingFunction, Rect, Size};

/// The style buffer is writable by platform code and the workspace builds with
/// `panic = "abort"`, so every decoder below is total: an unrecognized type tag
/// falls back to the meaning of tag `0` (what a zeroed buffer decodes to) and
/// `NaN` values are clamped. Infinities are kept — taffy uses them as sentinels.
#[inline(always)]
fn sanitize(value: f32) -> f32 {
    if value.is_nan() {
        0.0
    } else {
        value
    }
}

#[inline(always)]
pub fn length_percentage_auto_from_type_value(value_type: i8, value: f32) -> LengthPercentageAuto {
    let value = sanitize(value);
    match value_type {
        1 => LengthPercentageAuto::length(value),
        2 => LengthPercentageAuto::percent(value),
        _ => LengthPercentageAuto::auto(),
    }
}

#[inline(always)]
pub fn length_percentage_auto_to_type_value(value: LengthPercentageAuto) -> (i8, f32) {
    if value.is_auto() {
        return (0, 0.0);
    }
    let raw = value.into_raw();
    match raw.tag() {
        CompactLength::PERCENT_TAG => (2, raw.value()),
        _ => (1, raw.value()),
    }
}

#[inline(always)]
pub fn length_percentage_auto_to_format_type_value(value: LengthPercentageAuto) -> String {
    if value.is_auto() {
        return "auto".to_string();
    }
    let raw = value.into_raw();
    match raw.tag() {
        CompactLength::PERCENT_TAG => std::format!("{:?}%", raw.value()),
        _ => std::format!("{:?}", raw.value()),
    }
}

#[inline(always)]
pub fn length_percentage_to_type_value(value: LengthPercentage) -> (i8, f32) {
    let raw = value.into_raw();
    match raw.tag() {
        CompactLength::PERCENT_TAG => (1, raw.value()),
        _ => (0, raw.value()),
    }
}

#[inline(always)]
pub fn length_percentage_to_format_type_value(value: LengthPercentage) -> String {
    let raw = value.into_raw();
    match raw.tag() {
        CompactLength::PERCENT_TAG => std::format!("{:?}%", raw.value()),
        _ => std::format!("{:?}", raw.value()),
    }
}

#[inline(always)]
pub fn length_percentage_from_type_value(value_type: i8, value: f32) -> LengthPercentage {
    let value = sanitize(value);
    match value_type {
        1 => LengthPercentage::percent(value),
        _ => LengthPercentage::length(value),
    }
}

#[inline(always)]
pub fn dimension_from_type_value(value_type: i8, value: f32) -> Dimension {
    // todo handle calc when supported
    let value = sanitize(value);
    match value_type {
        1 => Dimension::length(value),
        2 => Dimension::percent(value),
        _ => Dimension::auto(),
    }
}

#[inline(always)]
pub fn dimension_to_type_value(value: Dimension) -> (i8, f32) {
    if value.is_auto() {
        return (0, 0.0);
    }
    let raw = value.into_raw();
    match raw.tag() {
        CompactLength::PERCENT_TAG => (2, raw.value()),
        _ => (1, raw.value()),
    }
}

#[inline(always)]
pub fn dimension_to_format_type_value(value: Dimension) -> String {
    if value.is_auto() {
        return "auto".to_string();
    }
    let raw = value.into_raw();
    match raw.tag() {
        CompactLength::PERCENT_TAG => std::format!("{:?}%", raw.value()),
        _ => std::format!("{:?}", raw.value()),
    }
}

pub fn dimension_with_auto(t: i8, v: f32) -> LengthPercentageAuto {
    length_percentage_auto_from_type_value(t, v)
}

fn dimension(t: i8, v: f32) -> LengthPercentage {
    length_percentage_from_type_value(t, v)
}

pub fn min_max_from_values(
    min_type: i8,
    min_value: f32,
    max_type: i8,
    max_value: f32,
) -> TrackSizingFunction {
    let min_value = sanitize(min_value);
    let max_value = sanitize(max_value);
    TrackSizingFunction {
        min: match min_type {
            1 => MinTrackSizingFunction::MIN_CONTENT,
            2 => MinTrackSizingFunction::MAX_CONTENT,
            3 => MinTrackSizingFunction::from_length(min_value),
            4 => MinTrackSizingFunction::from_percent(min_value),
            _ => MinTrackSizingFunction::AUTO,
        },
        max: match max_type {
            1 => MaxTrackSizingFunction::MIN_CONTENT,
            2 => MaxTrackSizingFunction::MAX_CONTENT,
            3 => MaxTrackSizingFunction::from_length(max_value),
            4 => MaxTrackSizingFunction::from_percent(max_value),
            5 => MaxTrackSizingFunction::fr(max_value),
            6 => MaxTrackSizingFunction::fit_content(LengthPercentage::length(max_value)),
            7 => MaxTrackSizingFunction::fit_content(LengthPercentage::percent(max_value)),
            _ => MaxTrackSizingFunction::AUTO,
        },
    }
}

pub fn set_inset_lrtb(
    style: &mut Style,
    left: LengthPercentageAuto,
    right: LengthPercentageAuto,
    top: LengthPercentageAuto,
    bottom: LengthPercentageAuto,
) {
    style.set_inset(Rect {
        left,
        right,
        top,
        bottom,
    });
}

pub fn set_margin_lrtb(
    style: &mut Style,
    left: LengthPercentageAuto,
    right: LengthPercentageAuto,
    top: LengthPercentageAuto,
    bottom: LengthPercentageAuto,
) {
    style.set_margin(Rect {
        left,
        right,
        top,
        bottom,
    });
}

pub fn set_padding_lrtb(
    style: &mut Style,
    left: LengthPercentage,
    right: LengthPercentage,
    top: LengthPercentage,
    bottom: LengthPercentage,
) {
    style.set_padding(Rect {
        left,
        right,
        top,
        bottom,
    });
}

pub fn set_border_lrtb(
    style: &mut Style,
    left: LengthPercentage,
    right: LengthPercentage,
    top: LengthPercentage,
    bottom: LengthPercentage,
) {
    style.set_border(Rect {
        left,
        right,
        top,
        bottom,
    });
}

pub fn set_aspect_ratio(style: &mut Style, ratio: Option<f32>) {
    style.set_aspect_ratio(ratio);
}

#[allow(clippy::too_many_arguments)]
pub fn update_from_ffi(
    style: &mut Style,
    display: i8,
    position: i8,
    direction: i8,
    flex_direction: i8,
    flex_wrap: i8,
    _overflow: i8,
    align_items: i8,
    align_self: i8,
    align_content: i8,
    justify_items: i8,
    justify_self: i8,
    justify_content: i8,
    inset_left_type: i8,
    inset_left_value: f32,
    inset_right_type: i8,
    inset_right_value: f32,
    inset_top_type: i8,
    inset_top_value: f32,
    inset_bottom_type: i8,
    inset_bottom_value: f32,
    margin_left_type: i8,
    margin_left_value: f32,
    margin_right_type: i8,
    margin_right_value: f32,
    margin_top_type: i8,
    margin_top_value: f32,
    margin_bottom_type: i8,
    margin_bottom_value: f32,
    padding_left_type: i8,
    padding_left_value: f32,
    padding_right_type: i8,
    padding_right_value: f32,
    padding_top_type: i8,
    padding_top_value: f32,
    padding_bottom_type: i8,
    padding_bottom_value: f32,
    border_left_type: i8,
    border_left_value: f32,
    border_right_type: i8,
    border_right_value: f32,
    border_top_type: i8,
    border_top_value: f32,
    border_bottom_type: i8,
    border_bottom_value: f32,
    flex_grow: f32,
    flex_shrink: f32,
    flex_basis_type: i8,
    flex_basis_value: f32,
    width_type: i8,
    width_value: f32,
    height_type: i8,
    height_value: f32,
    min_width_type: i8,
    min_width_value: f32,
    min_height_type: i8,
    min_height_value: f32,
    max_width_type: i8,
    max_width_value: f32,
    max_height_type: i8,
    max_height_value: f32,
    gap_row_type: i8,
    gap_row_value: f32,
    gap_column_type: i8,
    gap_column_value: f32,
    aspect_ratio: f32,
    grid_auto_rows: Option<&str>,
    grid_auto_columns: Option<&str>,
    grid_auto_flow: i8,
    grid_column: Option<&str>,
    grid_column_start: Option<&str>,
    grid_column_end: Option<&str>,
    grid_row: Option<&str>,
    grid_row_start: Option<&str>,
    grid_row_end: Option<&str>,
    grid_template_rows: Option<&str>,
    grid_template_columns: Option<&str>,
    overflow_x: i8,
    overflow_y: i8,
    scrollbar_width: f32,
    text_align: i8,
    box_sizing: i8,
    grid_area: Option<&str>,
    grid_template_areas: Option<&str>,
) {
    if let Some(display) = display_from_enum(display) {
        style.set_display(display);
    }

    if let Some(position) = position_from_enum(position) {
        style.set_position(position);
    }

    if let Some(direction) = direction_from_enum(direction) {
        style.set_direction(direction);
    }

    if let Some(flex_direction) = flex_direction_from_enum(flex_direction) {
        style.set_flex_direction(flex_direction);
    }

    if let Some(flex_wrap) = flex_wrap_from_enum(flex_wrap) {
        style.set_flex_wrap(flex_wrap);
    }

    style.set_scrollbar_width(scrollbar_width);

    if let Some(overflow) = overflow_from_enum(_overflow) {
        style.set_overflow(Point {
            x: overflow,
            y: overflow,
        })
    }

    if let Some(overflow_x) = overflow_from_enum(overflow_x) {
        style.set_overflow_x(overflow_x);
    }

    if let Some(overflow_y) = overflow_from_enum(overflow_y) {
        style.set_overflow_y(overflow_y);
    }

    if align_items == -1 {
        style.set_align_items(None);
    } else if let Some(align_items) = align_items_from_enum(align_items) {
        style.set_align_items(Some(align_items));
    }

    if align_self == -1 {
        style.set_align_self(None);
    } else if let Some(align_self) = align_self_from_enum(align_self) {
        style.set_align_self(Some(align_self));
    }

    if align_content == -1 {
        style.set_align_content(None);
    } else if let Some(align_content) = align_content_from_enum(align_content) {
        style.set_align_content(Some(align_content));
    }

    if justify_items == -1 {
        style.set_justify_items(None);
    } else if let Some(justify_items) = align_items_from_enum(justify_items) {
        style.set_justify_items(Some(justify_items));
    }

    if justify_self == -1 {
        style.set_justify_self(None);
    } else if let Some(justify_self) = align_self_from_enum(justify_self) {
        style.set_justify_self(Some(justify_self));
    }

    if justify_content == -1 {
        style.set_justify_content(None);
    } else if let Some(justify_content) = justify_content_from_enum(justify_content) {
        style.set_justify_content(Some(justify_content));
    }

    style.set_inset(Rect {
        left: dimension_with_auto(inset_left_type, inset_left_value),
        top: dimension_with_auto(inset_top_type, inset_top_value),
        bottom: dimension_with_auto(inset_bottom_type, inset_bottom_value),
        right: dimension_with_auto(inset_right_type, inset_right_value),
    });

    style.set_margin(Rect {
        left: dimension_with_auto(margin_left_type, margin_left_value),
        right: dimension_with_auto(margin_right_type, margin_right_value),
        top: dimension_with_auto(margin_top_type, margin_top_value),
        bottom: dimension_with_auto(margin_bottom_type, margin_bottom_value),
    });

    style.set_padding(Rect {
        left: dimension(padding_left_type, padding_left_value),
        right: dimension(padding_right_type, padding_right_value),
        top: dimension(padding_top_type, padding_top_value),
        bottom: dimension(padding_bottom_type, padding_bottom_value),
    });

    style.set_border(Rect {
        left: dimension(border_left_type, border_left_value),
        right: dimension(border_right_type, border_right_value),
        top: dimension(border_top_type, border_top_value),
        bottom: dimension(border_bottom_type, border_bottom_value),
    });

    style.set_gap(Size {
        width: dimension(gap_row_type, gap_row_value),
        height: dimension(gap_column_type, gap_column_value),
    });
    style.set_flex_grow(flex_grow);
    style.set_flex_shrink(flex_shrink);

    style.set_flex_basis(dimension_with_auto(flex_basis_type, flex_basis_value).into());

    style.set_size(Size {
        width: dimension_with_auto(width_type, width_value).into(),
        height: dimension_with_auto(height_type, height_value).into(),
    });

    style.set_min_size(Size {
        width: dimension_with_auto(min_width_type, min_width_value).into(),
        height: dimension_with_auto(min_height_type, min_height_value).into(),
    });

    style.set_max_size(Size {
        width: dimension_with_auto(max_width_type, max_width_value).into(),
        height: dimension_with_auto(max_height_type, max_height_value).into(),
    });

    style.set_aspect_ratio(if f32::is_nan(aspect_ratio) {
        None
    } else {
        Some(aspect_ratio)
    });

    if let Some(area) = grid_area {
        style.set_grid_area(area);
    }

    if let Some(grid_template_rows) = grid_template_rows {
        style.set_grid_template_rows_css(grid_template_rows);
    }

    if let Some(grid_template_columns) = grid_template_columns {
        style.set_grid_template_columns_css(grid_template_columns);
    }

    if let Some(grid_auto_rows) = grid_auto_rows {
        style.set_grid_auto_rows_css(grid_auto_rows);
    }

    if let Some(grid_auto_columns) = grid_auto_columns {
        style.set_grid_auto_columns_css(grid_auto_columns);
    }

    if let Some(grid_auto_flow) = grid_auto_flow_from_enum(grid_auto_flow) {
        style.set_grid_auto_flow(grid_auto_flow);
    }

    if let Some(grid_row) = grid_row {
        style.set_grid_row_css(grid_row)
    }

    if let Some(start) = grid_row_start {
        style.set_grid_row_start_css(start)
    }

    if let Some(end) = grid_row_end {
        style.set_grid_row_end_css(end)
    }

    if let Some(grid_column) = grid_column {
        style.set_grid_column_css(grid_column)
    }

    if let Some(start) = grid_column_start {
        style.set_grid_column_start_css(start)
    }

    if let Some(end) = grid_column_end {
        style.set_grid_column_end_css(end)
    }

    if let Some(text_align) = text_align_from_enum(text_align) {
        style.set_text_align(text_align);
    }

    if let Some(box_sizing) = box_sizing_from_enum(box_sizing) {
        style.set_box_sizing(box_sizing);
    }

    if let Some(areas) = grid_template_areas {
        style.set_grid_template_areas_css(areas)
    }
}

#[inline(always)]
pub(crate) fn set_style_data_i32(style: &mut [u8], position: StyleKeys, value: i32) {
    let offset = position as usize;
    unsafe {
        let ptr = style.as_mut_ptr().add(offset) as *mut i32;
        ptr.write_unaligned(value.to_le());
    }
}

#[inline(always)]
pub(crate) fn set_style_data_u32(style: &mut [u8], position: StyleKeys, value: u32) {
    let offset = position as usize;

    unsafe {
        let ptr = style.as_mut_ptr().add(offset) as *mut u32;
        ptr.write_unaligned(value.to_le());
    }
}

#[inline(always)]
pub(crate) fn set_style_data_f32(style: &mut [u8], position: StyleKeys, value: f32) {
    let offset = position as usize;
    unsafe {
        let ptr = style.as_mut_ptr().add(offset) as *mut u32;
        ptr.write_unaligned(value.to_bits().to_le());
    }
}

#[inline(always)]
pub(crate) fn get_style_data_i32(style: &[u8], position: StyleKeys) -> i32 {
    let offset = position as usize;
    let ptr: [u8; 4] = <[u8; 4]>::try_from(&style[offset..offset + 4]).unwrap();

    if cfg!(target_endian = "little") {
        i32::from_le_bytes(ptr)
    } else {
        i32::from_be_bytes(ptr)
    }
}


#[inline(always)]
pub(crate) fn get_style_data_f32(style: &[u8], position: StyleKeys) -> f32 {
    let offset = position as usize;
    unsafe {
        let ptr = style.as_ptr().add(offset) as *const u32;
        f32::from_bits(u32::from_le(ptr.read_unaligned()))
    }
}

#[inline(always)]
pub(crate) fn set_style_data_bool(style: &mut [u8], position: StyleKeys, value: bool) {
    unsafe {
        *style.as_mut_ptr().add(position as usize) = value as u8;
    }
}

#[inline(always)]
pub(crate) fn get_style_data_bool(style: &[u8], position: StyleKeys) -> bool {
    unsafe { *style.as_ptr().add(position as usize) != 0 }
}

#[inline(always)]
pub(crate) fn set_style_data_u8(style: &mut [u8], position: StyleKeys, value: u8) {
    unsafe { *style.as_mut_ptr().add(position as usize) = value }
}

#[inline(always)]
pub(crate) fn get_style_data_u8(style: &[u8], position: StyleKeys) -> u8 {
    unsafe { *style.as_ptr().add(position as usize) }
}

#[inline(always)]
pub(crate) fn set_style_data_i8(style: &mut [u8], position: StyleKeys, value: i8) {
    unsafe { *style.as_mut_ptr().add(position as usize) = value as u8 }
}

#[inline(always)]
pub(crate) fn get_style_data_i8(style: &[u8], position: StyleKeys) -> i8 {
    unsafe { *style.as_ptr().add(position as usize) as i8 }
}

#[inline(always)]
pub(crate) fn set_style_data_i8_raw(style: &mut [u8], position: usize, value: i8) {
    unsafe { *style.as_mut_ptr().add(position) = value as u8 };
}

#[inline(always)]
pub(crate) fn get_style_data_i8_raw(style: &[u8], position: usize) -> i8 {
    unsafe { *style.as_ptr().add(position) as i8 }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Regression test: the raw getter used to return the *address* of the
    /// byte instead of the byte, so every flag read as garbage (almost always
    /// non-zero).
    #[test]
    fn get_style_data_i8_raw_reads_the_byte() {
        let mut buffer = [0u8; 8];
        set_style_data_i8_raw(&mut buffer, 3, 1);

        assert_eq!(get_style_data_i8_raw(&buffer, 3), 1);
        assert_eq!(get_style_data_i8_raw(&buffer, 0), 0);
        assert_eq!(get_style_data_i8_raw(&buffer, 7), 0);

        set_style_data_i8_raw(&mut buffer, 3, 0);
        assert_eq!(get_style_data_i8_raw(&buffer, 3), 0);

        set_style_data_i8_raw(&mut buffer, 5, -1);
        assert_eq!(get_style_data_i8_raw(&buffer, 5), -1);
    }

    /// Regression test: decoding a byte platform code can corrupt must not
    /// panic — the workspace builds with `panic = "abort"`.
    #[test]
    fn out_of_range_type_tags_fall_back_instead_of_panicking() {
        for tag in [-128i8, -1, 3, 7, 42, 127] {
            assert!(length_percentage_auto_from_type_value(tag, 10.0).is_auto());
            assert!(dimension_from_type_value(tag, 10.0).is_auto());
        }

        for tag in [-128i8, -1, 2, 42, 127] {
            assert_eq!(
                length_percentage_from_type_value(tag, 10.0),
                LengthPercentage::length(10.0)
            );
        }

        for tag in [-128i8, -1, 8, 42, 127] {
            let track = min_max_from_values(tag, 10.0, tag, 10.0);
            assert_eq!(track.min, MinTrackSizingFunction::AUTO);
            assert_eq!(track.max, MaxTrackSizingFunction::AUTO);
        }
    }

    #[test]
    fn in_range_type_tags_are_unchanged() {
        assert!(length_percentage_auto_from_type_value(0, 0.0).is_auto());
        assert_eq!(
            length_percentage_auto_from_type_value(1, 5.0),
            LengthPercentageAuto::length(5.0)
        );
        assert_eq!(
            length_percentage_auto_from_type_value(2, 5.0),
            LengthPercentageAuto::percent(5.0)
        );

        assert_eq!(
            length_percentage_from_type_value(0, 5.0),
            LengthPercentage::length(5.0)
        );
        assert_eq!(
            length_percentage_from_type_value(1, 5.0),
            LengthPercentage::percent(5.0)
        );

        assert!(dimension_from_type_value(0, 0.0).is_auto());
        assert_eq!(dimension_from_type_value(1, 5.0), Dimension::length(5.0));
        assert_eq!(dimension_from_type_value(2, 5.0), Dimension::percent(5.0));

        let track = min_max_from_values(3, 5.0, 5, 2.0);
        assert_eq!(track.min, MinTrackSizingFunction::from_length(5.0));
        assert_eq!(track.max, MaxTrackSizingFunction::fr(2.0));
    }

    #[test]
    fn nan_values_are_clamped_but_infinity_is_kept() {
        assert_eq!(
            length_percentage_auto_from_type_value(1, f32::NAN),
            LengthPercentageAuto::length(0.0)
        );
        assert_eq!(
            length_percentage_from_type_value(1, f32::NAN),
            LengthPercentage::percent(0.0)
        );
        assert_eq!(dimension_from_type_value(2, f32::NAN), Dimension::percent(0.0));

        let track = min_max_from_values(3, f32::NAN, 3, f32::NAN);
        assert_eq!(track.min, MinTrackSizingFunction::from_length(0.0));
        assert_eq!(track.max, MaxTrackSizingFunction::from_length(0.0));

        assert_eq!(
            dimension_from_type_value(1, f32::INFINITY),
            Dimension::length(f32::INFINITY)
        );
    }

    /// Round-trips still hold for every tag the encoders can emit.
    #[test]
    fn type_value_round_trips() {
        for value in [LengthPercentageAuto::AUTO, LengthPercentageAuto::length(3.5), LengthPercentageAuto::percent(0.5)] {
            let (tag, v) = length_percentage_auto_to_type_value(value);
            assert_eq!(length_percentage_auto_from_type_value(tag, v), value);
        }

        for value in [LengthPercentage::length(3.5), LengthPercentage::percent(0.5)] {
            let (tag, v) = length_percentage_to_type_value(value);
            assert_eq!(length_percentage_from_type_value(tag, v), value);
        }

        for value in [Dimension::auto(), Dimension::length(3.5), Dimension::percent(0.5)] {
            let (tag, v) = dimension_to_type_value(value);
            assert_eq!(dimension_from_type_value(tag, v), value);
        }
    }
}
