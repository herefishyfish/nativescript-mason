#if 0
#elif defined(__arm64__) && __arm64__
// Generated by Apple Swift version 5.7 (swiftlang-5.7.0.127.4 clang-1400.0.29.50)
#ifndef MASON_SWIFT_H
#define MASON_SWIFT_H
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgcc-compat"

#if !defined(__has_include)
# define __has_include(x) 0
#endif
#if !defined(__has_attribute)
# define __has_attribute(x) 0
#endif
#if !defined(__has_feature)
# define __has_feature(x) 0
#endif
#if !defined(__has_warning)
# define __has_warning(x) 0
#endif

#if __has_include(<swift/objc-prologue.h>)
# include <swift/objc-prologue.h>
#endif

#pragma clang diagnostic ignored "-Wduplicate-method-match"
#pragma clang diagnostic ignored "-Wauto-import"
#if defined(__OBJC__)
#include <Foundation/Foundation.h>
#endif
#if defined(__cplusplus)
#include <cstdint>
#include <cstddef>
#include <cstdbool>
#else
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#endif

#if !defined(SWIFT_TYPEDEFS)
# define SWIFT_TYPEDEFS 1
# if __has_include(<uchar.h>)
#  include <uchar.h>
# elif !defined(__cplusplus)
typedef uint_least16_t char16_t;
typedef uint_least32_t char32_t;
# endif
typedef float swift_float2  __attribute__((__ext_vector_type__(2)));
typedef float swift_float3  __attribute__((__ext_vector_type__(3)));
typedef float swift_float4  __attribute__((__ext_vector_type__(4)));
typedef double swift_double2  __attribute__((__ext_vector_type__(2)));
typedef double swift_double3  __attribute__((__ext_vector_type__(3)));
typedef double swift_double4  __attribute__((__ext_vector_type__(4)));
typedef int swift_int2  __attribute__((__ext_vector_type__(2)));
typedef int swift_int3  __attribute__((__ext_vector_type__(3)));
typedef int swift_int4  __attribute__((__ext_vector_type__(4)));
typedef unsigned int swift_uint2  __attribute__((__ext_vector_type__(2)));
typedef unsigned int swift_uint3  __attribute__((__ext_vector_type__(3)));
typedef unsigned int swift_uint4  __attribute__((__ext_vector_type__(4)));
#endif

#if !defined(SWIFT_PASTE)
# define SWIFT_PASTE_HELPER(x, y) x##y
# define SWIFT_PASTE(x, y) SWIFT_PASTE_HELPER(x, y)
#endif
#if !defined(SWIFT_METATYPE)
# define SWIFT_METATYPE(X) Class
#endif
#if !defined(SWIFT_CLASS_PROPERTY)
# if __has_feature(objc_class_property)
#  define SWIFT_CLASS_PROPERTY(...) __VA_ARGS__
# else
#  define SWIFT_CLASS_PROPERTY(...)
# endif
#endif

#if __has_attribute(objc_runtime_name)
# define SWIFT_RUNTIME_NAME(X) __attribute__((objc_runtime_name(X)))
#else
# define SWIFT_RUNTIME_NAME(X)
#endif
#if __has_attribute(swift_name)
# define SWIFT_COMPILE_NAME(X) __attribute__((swift_name(X)))
#else
# define SWIFT_COMPILE_NAME(X)
#endif
#if __has_attribute(objc_method_family)
# define SWIFT_METHOD_FAMILY(X) __attribute__((objc_method_family(X)))
#else
# define SWIFT_METHOD_FAMILY(X)
#endif
#if __has_attribute(noescape)
# define SWIFT_NOESCAPE __attribute__((noescape))
#else
# define SWIFT_NOESCAPE
#endif
#if __has_attribute(ns_consumed)
# define SWIFT_RELEASES_ARGUMENT __attribute__((ns_consumed))
#else
# define SWIFT_RELEASES_ARGUMENT
#endif
#if __has_attribute(warn_unused_result)
# define SWIFT_WARN_UNUSED_RESULT __attribute__((warn_unused_result))
#else
# define SWIFT_WARN_UNUSED_RESULT
#endif
#if __has_attribute(noreturn)
# define SWIFT_NORETURN __attribute__((noreturn))
#else
# define SWIFT_NORETURN
#endif
#if !defined(SWIFT_CLASS_EXTRA)
# define SWIFT_CLASS_EXTRA
#endif
#if !defined(SWIFT_PROTOCOL_EXTRA)
# define SWIFT_PROTOCOL_EXTRA
#endif
#if !defined(SWIFT_ENUM_EXTRA)
# define SWIFT_ENUM_EXTRA
#endif
#if !defined(SWIFT_CLASS)
# if __has_attribute(objc_subclassing_restricted)
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# else
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# endif
#endif
#if !defined(SWIFT_RESILIENT_CLASS)
# if __has_attribute(objc_class_stub)
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME) __attribute__((objc_class_stub))
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_class_stub)) SWIFT_CLASS_NAMED(SWIFT_NAME)
# else
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME)
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) SWIFT_CLASS_NAMED(SWIFT_NAME)
# endif
#endif

#if !defined(SWIFT_PROTOCOL)
# define SWIFT_PROTOCOL(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
# define SWIFT_PROTOCOL_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
#endif

#if !defined(SWIFT_EXTENSION)
# define SWIFT_EXTENSION(M) SWIFT_PASTE(M##_Swift_, __LINE__)
#endif

#if !defined(OBJC_DESIGNATED_INITIALIZER)
# if __has_attribute(objc_designated_initializer)
#  define OBJC_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
# else
#  define OBJC_DESIGNATED_INITIALIZER
# endif
#endif
#if !defined(SWIFT_ENUM_ATTR)
# if defined(__has_attribute) && __has_attribute(enum_extensibility)
#  define SWIFT_ENUM_ATTR(_extensibility) __attribute__((enum_extensibility(_extensibility)))
# else
#  define SWIFT_ENUM_ATTR(_extensibility)
# endif
#endif
#if !defined(SWIFT_ENUM)
# define SWIFT_ENUM(_type, _name, _extensibility) enum _name : _type _name; enum SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# if __has_feature(generalized_swift_name)
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) enum _name : _type _name SWIFT_COMPILE_NAME(SWIFT_NAME); enum SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# else
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) SWIFT_ENUM(_type, _name, _extensibility)
# endif
#endif
#if !defined(SWIFT_UNAVAILABLE)
# define SWIFT_UNAVAILABLE __attribute__((unavailable))
#endif
#if !defined(SWIFT_UNAVAILABLE_MSG)
# define SWIFT_UNAVAILABLE_MSG(msg) __attribute__((unavailable(msg)))
#endif
#if !defined(SWIFT_AVAILABILITY)
# define SWIFT_AVAILABILITY(plat, ...) __attribute__((availability(plat, __VA_ARGS__)))
#endif
#if !defined(SWIFT_WEAK_IMPORT)
# define SWIFT_WEAK_IMPORT __attribute__((weak_import))
#endif
#if !defined(SWIFT_DEPRECATED)
# define SWIFT_DEPRECATED __attribute__((deprecated))
#endif
#if !defined(SWIFT_DEPRECATED_MSG)
# define SWIFT_DEPRECATED_MSG(...) __attribute__((deprecated(__VA_ARGS__)))
#endif
#if __has_feature(attribute_diagnose_if_objc)
# define SWIFT_DEPRECATED_OBJC(Msg) __attribute__((diagnose_if(1, Msg, "warning")))
#else
# define SWIFT_DEPRECATED_OBJC(Msg) SWIFT_DEPRECATED_MSG(Msg)
#endif
#if defined(__OBJC__)
#if !defined(IBSegueAction)
# define IBSegueAction
#endif
#endif
#if !defined(SWIFT_EXTERN)
# if defined(__cplusplus)
#  define SWIFT_EXTERN extern "C"
# else
#  define SWIFT_EXTERN extern
# endif
#endif
#if !defined(SWIFT_CALL)
# define SWIFT_CALL __attribute__((swiftcall))
#endif
#if defined(__cplusplus)
#if !defined(SWIFT_NOEXCEPT)
# define SWIFT_NOEXCEPT noexcept
#endif
#else
#if !defined(SWIFT_NOEXCEPT)
# define SWIFT_NOEXCEPT 
#endif
#endif
#if defined(__cplusplus)
#if !defined(SWIFT_CXX_INT_DEFINED)
#define SWIFT_CXX_INT_DEFINED
namespace swift {
using Int = ptrdiff_t;
using UInt = size_t;
}
#endif
#endif
#if defined(__OBJC__)
#if __has_feature(modules)
#if __has_warning("-Watimport-in-framework-header")
#pragma clang diagnostic ignored "-Watimport-in-framework-header"
#endif
@import Foundation;
@import ObjectiveC;
@import UIKit;
#endif

#import <Mason/Mason.h>

#endif
#pragma clang diagnostic ignored "-Wproperty-attribute-mismatch"
#pragma clang diagnostic ignored "-Wduplicate-method-arg"
#if __has_warning("-Wpragma-clang-attribute")
# pragma clang diagnostic ignored "-Wpragma-clang-attribute"
#endif
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma clang diagnostic ignored "-Wnullability"
#pragma clang diagnostic ignored "-Wdollar-in-identifier-extension"

#if __has_attribute(external_source_symbol)
# pragma push_macro("any")
# undef any
# pragma clang attribute push(__attribute__((external_source_symbol(language="Swift", defined_in="Mason",generated_declaration))), apply_to=any(function,enum,objc_interface,objc_category,objc_protocol))
# pragma pop_macro("any")
#endif

#if defined(__OBJC__)
typedef SWIFT_ENUM_NAMED(NSInteger, AlignContent, "AlignContent", open) {
  AlignContentNormal = 0,
  AlignContentStart = 1,
  AlignContentEnd = 2,
  AlignContentCenter = 3,
  AlignContentStretch = 4,
  AlignContentSpaceBetween = 5,
  AlignContentSpaceAround = 6,
  AlignContentSpaceEvenly = 7,
};

typedef SWIFT_ENUM_NAMED(NSInteger, AlignItems, "AlignItems", open) {
  AlignItemsNormal = 0,
  AlignItemsStart = 1,
  AlignItemsEnd = 2,
  AlignItemsCenter = 3,
  AlignItemsBaseline = 4,
  AlignItemsStretch = 5,
};

typedef SWIFT_ENUM_NAMED(NSInteger, AlignSelf, "AlignSelf", open) {
  AlignSelfNormal = 0,
  AlignSelfStart = 1,
  AlignSelfEnd = 2,
  AlignSelfCenter = 3,
  AlignSelfBaseline = 4,
  AlignSelfStretch = 5,
};

typedef SWIFT_ENUM_NAMED(NSInteger, Direction, "Direction", open) {
  DirectionInherit = 0,
  DirectionLTR = 1,
  DirectionRTL = 2,
};

typedef SWIFT_ENUM_NAMED(NSInteger, Display, "Display", open) {
  DisplayNone = 0,
  DisplayFlex = 1,
  DisplayGrid = 2,
};

typedef SWIFT_ENUM_NAMED(NSInteger, FlexDirection, "FlexDirection", open) {
  FlexDirectionRow = 0,
  FlexDirectionColumn = 1,
  FlexDirectionRowReverse = 2,
  FlexDirectionColumnReverse = 3,
};

typedef SWIFT_ENUM_NAMED(NSInteger, FlexWrap, "FlexWrap", open) {
  FlexWrapNoWrap = 0,
  FlexWrapWrap = 1,
  FlexWrapWrapReverse = 2,
};

typedef SWIFT_ENUM_NAMED(NSInteger, FlexGridAutoFlowWrap, "GridAutoFlow", open) {
  FlexGridAutoFlowWrapRow = 0,
  FlexGridAutoFlowWrapColumn = 1,
  FlexGridAutoFlowWrapRowDense = 2,
  FlexGridAutoFlowWrapColumnDense = 3,
};

enum GridPlacementCompatType : NSInteger;
@class NSString;

SWIFT_CLASS_NAMED("GridPlacementCompat")
@interface GridPlacementCompat : NSObject
- (nonnull instancetype)initWithSpan:(int16_t)span OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithLine:(int16_t)line OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic, readonly) enum GridPlacementCompatType type;
@property (nonatomic, readonly) int16_t value;
@property (nonatomic, readonly, copy) NSString * _Nonnull cssValue;
@property (nonatomic, readonly, copy) NSString * _Nullable jsonValue;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) GridPlacementCompat * _Nonnull Auto;)
+ (GridPlacementCompat * _Nonnull)Auto SWIFT_WARN_UNUSED_RESULT;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end

typedef SWIFT_ENUM_NAMED(NSInteger, GridPlacementCompatType, "GridPlacementCompatType", open) {
  GridPlacementCompatTypeAuto = 0,
  GridPlacementCompatTypeLine = 1,
  GridPlacementCompatTypeSpan = 2,
};

typedef SWIFT_ENUM_NAMED(NSInteger, GridTrackRepetition, "GridTrackRepetition", open) {
  GridTrackRepetitionAutoFill = 0,
  GridTrackRepetitionAutoFit = 1,
};

typedef SWIFT_ENUM_NAMED(NSInteger, JustifyContent, "JustifyContent", open) {
  JustifyContentNormal = 0,
  JustifyContentStart = 1,
  JustifyContentEnd = 2,
  JustifyContentCenter = 3,
  JustifyContentStretch = 4,
  JustifyContentSpaceBetween = 5,
  JustifyContentSpaceAround = 6,
  JustifyContentSpaceEvenly = 7,
};

typedef SWIFT_ENUM_NAMED(NSInteger, JustifyItems, "JustifyItems", open) {
  JustifyItemsNormal = -1,
  JustifyItemsStart = 0,
  JustifyItemsEnd = 1,
  JustifyItemsCenter = 2,
  JustifyItemsBaseline = 3,
  JustifyItemsStretch = 4,
};

typedef SWIFT_ENUM_NAMED(NSInteger, JustifySelf, "JustifySelf", open) {
  JustifySelfNormal = -1,
  JustifySelfStart = 0,
  JustifySelfEnd = 1,
  JustifySelfCenter = 2,
  JustifySelfBaseline = 3,
  JustifySelfStretch = 4,
};

enum MasonDimensionCompatType : NSInteger;

SWIFT_CLASS_NAMED("MasonDimensionCompat")
@interface MasonDimensionCompat : NSObject
- (nonnull instancetype)initWithPoints:(float)points OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithPercent:(float)percent OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic, readonly) enum MasonDimensionCompatType type;
@property (nonatomic, readonly) float value;
@property (nonatomic, readonly, copy) NSString * _Nonnull cssValue;
@property (nonatomic, readonly, copy) NSString * _Nullable jsonValue;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) MasonDimensionCompat * _Nonnull Auto;)
+ (MasonDimensionCompat * _Nonnull)Auto SWIFT_WARN_UNUSED_RESULT;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) MasonDimensionCompat * _Nonnull Zero;)
+ (MasonDimensionCompat * _Nonnull)Zero SWIFT_WARN_UNUSED_RESULT;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end

typedef SWIFT_ENUM_NAMED(NSInteger, MasonDimensionCompatType, "MasonDimensionCompatType", open) {
  MasonDimensionCompatTypeAuto = 0,
  MasonDimensionCompatTypePoints = 1,
  MasonDimensionCompatTypePercent = 2,
};


SWIFT_CLASS_NAMED("MasonDimensionRectCompat")
@interface MasonDimensionRectCompat : NSObject
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull left;
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull right;
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull top;
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull bottom;
- (nonnull instancetype)init:(MasonDimensionCompat * _Nonnull)left :(MasonDimensionCompat * _Nonnull)right :(MasonDimensionCompat * _Nonnull)top :(MasonDimensionCompat * _Nonnull)bottom OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


SWIFT_CLASS_NAMED("MasonDimensionSizeCompat")
@interface MasonDimensionSizeCompat : NSObject
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull width;
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull height;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


SWIFT_CLASS_NAMED("MasonLayout")
@interface MasonLayout : NSObject
@property (nonatomic, readonly) NSInteger order;
@property (nonatomic, readonly) float x;
@property (nonatomic, readonly) float y;
@property (nonatomic, readonly) float width;
@property (nonatomic, readonly) float height;
@property (nonatomic, readonly, copy) NSArray<MasonLayout *> * _Nonnull children;
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end

enum MasonLengthPercentageAutoCompatType : NSInteger;

SWIFT_CLASS_NAMED("MasonLengthPercentageAutoCompat")
@interface MasonLengthPercentageAutoCompat : NSObject
- (nonnull instancetype)initWithPoints:(float)points OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithPercent:(float)percent OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic, readonly) enum MasonLengthPercentageAutoCompatType type;
@property (nonatomic, readonly) float value;
@property (nonatomic, readonly, copy) NSString * _Nonnull cssValue;
@property (nonatomic, readonly, copy) NSString * _Nullable jsonValue;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) MasonLengthPercentageAutoCompat * _Nonnull Auto;)
+ (MasonLengthPercentageAutoCompat * _Nonnull)Auto SWIFT_WARN_UNUSED_RESULT;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) MasonLengthPercentageAutoCompat * _Nonnull Zero;)
+ (MasonLengthPercentageAutoCompat * _Nonnull)Zero SWIFT_WARN_UNUSED_RESULT;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end

typedef SWIFT_ENUM_NAMED(NSInteger, MasonLengthPercentageAutoCompatType, "MasonLengthPercentageAutoCompatType", open) {
  MasonLengthPercentageAutoCompatTypeAuto = 0,
  MasonLengthPercentageAutoCompatTypePoints = 1,
  MasonLengthPercentageAutoCompatTypePercent = 2,
};


SWIFT_CLASS_NAMED("MasonLengthPercentageAutoRectCompat")
@interface MasonLengthPercentageAutoRectCompat : NSObject
@property (nonatomic, strong) MasonLengthPercentageAutoCompat * _Nonnull left;
@property (nonatomic, strong) MasonLengthPercentageAutoCompat * _Nonnull right;
@property (nonatomic, strong) MasonLengthPercentageAutoCompat * _Nonnull top;
@property (nonatomic, strong) MasonLengthPercentageAutoCompat * _Nonnull bottom;
- (nonnull instancetype)init:(MasonLengthPercentageAutoCompat * _Nonnull)left :(MasonLengthPercentageAutoCompat * _Nonnull)right :(MasonLengthPercentageAutoCompat * _Nonnull)top :(MasonLengthPercentageAutoCompat * _Nonnull)bottom OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


SWIFT_CLASS_NAMED("MasonLengthPercentageAutoSizeCompat")
@interface MasonLengthPercentageAutoSizeCompat : NSObject
@property (nonatomic, strong) MasonLengthPercentageAutoCompat * _Nonnull width;
@property (nonatomic, strong) MasonLengthPercentageAutoCompat * _Nonnull height;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end

enum MasonLengthPercentageCompatType : NSInteger;

SWIFT_CLASS_NAMED("MasonLengthPercentageCompat")
@interface MasonLengthPercentageCompat : NSObject
- (nonnull instancetype)initWithPoints:(float)points OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithPercent:(float)percent OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic, readonly) enum MasonLengthPercentageCompatType type;
@property (nonatomic, readonly) float value;
@property (nonatomic, readonly, copy) NSString * _Nonnull cssValue;
@property (nonatomic, readonly, copy) NSString * _Nullable jsonValue;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) MasonLengthPercentageCompat * _Nonnull Zero;)
+ (MasonLengthPercentageCompat * _Nonnull)Zero SWIFT_WARN_UNUSED_RESULT;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end

typedef SWIFT_ENUM_NAMED(NSInteger, MasonLengthPercentageCompatType, "MasonLengthPercentageCompatType", open) {
  MasonLengthPercentageCompatTypePoints = 0,
  MasonLengthPercentageCompatTypePercent = 1,
};


SWIFT_CLASS_NAMED("MasonLengthPercentageRectCompat")
@interface MasonLengthPercentageRectCompat : NSObject
@property (nonatomic, strong) MasonLengthPercentageCompat * _Nonnull left;
@property (nonatomic, strong) MasonLengthPercentageCompat * _Nonnull right;
@property (nonatomic, strong) MasonLengthPercentageCompat * _Nonnull top;
@property (nonatomic, strong) MasonLengthPercentageCompat * _Nonnull bottom;
- (nonnull instancetype)init:(MasonLengthPercentageCompat * _Nonnull)left :(MasonLengthPercentageCompat * _Nonnull)right :(MasonLengthPercentageCompat * _Nonnull)top :(MasonLengthPercentageCompat * _Nonnull)bottom OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end


SWIFT_CLASS_NAMED("MasonLengthPercentageSizeCompat")
@interface MasonLengthPercentageSizeCompat : NSObject
@property (nonatomic, strong) MasonLengthPercentageCompat * _Nonnull width;
@property (nonatomic, strong) MasonLengthPercentageCompat * _Nonnull height;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_UNAVAILABLE_MSG("-init is unavailable");
@end

@class MasonStyle;

SWIFT_CLASS_NAMED("MasonNode")
@interface MasonNode : NSObject
@property (nonatomic, readonly) void * _Null_unspecified nativePtr;
@property (nonatomic, strong) MasonStyle * _Nonnull style;
@property (nonatomic) BOOL isEnabled;
@property (nonatomic, strong) id _Nullable data;
@property (nonatomic, readonly, strong) MasonNode * _Nullable owner;
@property (nonatomic, readonly, copy) NSArray<MasonNode *> * _Nonnull children;
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithStyle:(MasonStyle * _Nonnull)style OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithStyle:(MasonStyle * _Nonnull)style children:(NSArray<MasonNode *> * _Nonnull)children OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic, readonly) BOOL isDirty;
- (void)markDirty;
- (void)computeWithViewSize;
- (void)setChildrenWithChildren:(NSArray<MasonNode *> * _Nonnull)children;
- (void)addChildren:(NSArray<MasonNode *> * _Nonnull)children;
@property (nonatomic, readonly) BOOL isLeaf;
- (void)configure:(SWIFT_NOESCAPE void (^ _Nonnull)(MasonNode * _Nonnull))block;
@end


SWIFT_CLASS_NAMED("MasonReexports")
@interface MasonReexports : NSObject
+ (void)node_set_style:(void * _Nonnull)mason :(void * _Nonnull)node :(void * _Nonnull)style;
+ (void)node_compute:(void * _Nonnull)mason :(void * _Nonnull)node;
+ (void)node_compute_wh:(void * _Nonnull)mason :(void * _Nonnull)node width:(float)width height:(float)height;
+ (void)node_compute_max_content:(void * _Nonnull)mason :(void * _Nonnull)node;
+ (void)node_compute_min_content:(void * _Nonnull)mason :(void * _Nonnull)node;
+ (BOOL)node_dirty:(void * _Nonnull)mason :(void * _Nonnull)node SWIFT_WARN_UNUSED_RESULT;
+ (void)node_mark_dirty:(void * _Nonnull)mason :(void * _Nonnull)node;
+ (int32_t)style_get_display:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_display:(void * _Nonnull)style :(int32_t)display;
+ (int32_t)style_get_position:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_position:(void * _Nonnull)style :(int32_t)position;
+ (int32_t)style_get_direction:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_direction:(void * _Nonnull)style :(int32_t)direction;
+ (int32_t)style_get_flex_direction:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_flex_direction:(void * _Nonnull)style :(int32_t)flex_direction;
+ (int32_t)style_get_flex_wrap:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_flex_wrap:(void * _Nonnull)style :(int32_t)flex_wrap;
+ (int32_t)style_get_overflow:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_overflow:(void * _Nonnull)style :(int32_t)overflow;
+ (int32_t)style_get_align_items:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_align_items:(void * _Nonnull)style :(int32_t)align_items;
+ (int32_t)style_get_align_self:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_align_self:(void * _Nonnull)style :(int32_t)align_self;
+ (int32_t)style_get_align_content:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_align_content:(void * _Nonnull)style :(int32_t)align_content;
+ (int32_t)style_get_justify_items:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_justify_items:(void * _Nonnull)style :(int32_t)align_items;
+ (int32_t)style_get_justify_self:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_justify_self:(void * _Nonnull)style :(int32_t)align_self;
+ (int32_t)style_get_justify_content:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_justify_content:(void * _Nonnull)style :(int32_t)justify_content;
+ (void)style_set_inset:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_inset_left:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_inset_left:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_inset_right:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_inset_right:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_inset_top:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_inset_top:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_inset_bottom:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_inset_bottom:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (void)style_set_margin:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_margin_left:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_margin_left:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_margin_right:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_margin_right:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_margin_top:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_margin_top:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (CMasonLengthPercentageAuto)style_get_margin_bottom:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_margin_bottom:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageAutoType)value_type;
+ (void)style_set_padding:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_padding_left:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_padding_left:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_padding_right:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_padding_right:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_padding_top:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_padding_top:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_padding_bottom:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_padding_bottom:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (void)style_set_border:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_border_left:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_border_left:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_border_right:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_border_right:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_border_top:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_border_top:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_border_bottom:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_border_bottom:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (float)style_get_flex_grow:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_flex_grow:(void * _Nonnull)style :(float)value;
+ (void)style_set_border_bottom:(void * _Nonnull)style :(float)value;
+ (float)style_get_flex_shrink:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_flex_shrink:(void * _Nonnull)style :(float)value;
+ (void)style_set_flex_basis:(void * _Nonnull)style :(float)value :(CMasonDimensionType)value_type;
+ (CMasonDimension)style_get_flex_basis:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (CMasonDimension)style_get_width:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_width:(void * _Nonnull)style :(float)value :(CMasonDimensionType)value_type;
+ (CMasonDimension)style_get_height:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_height:(void * _Nonnull)style :(float)value :(CMasonDimensionType)value_type;
+ (CMasonDimension)style_get_min_width:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_min_width:(void * _Nonnull)style :(float)value :(CMasonDimensionType)value_type;
+ (CMasonDimension)style_get_min_height:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_min_height:(void * _Nonnull)style :(float)value :(CMasonDimensionType)value_type;
+ (CMasonDimension)style_get_max_width:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_max_width:(void * _Nonnull)style :(float)value :(CMasonDimensionType)value_type;
+ (CMasonDimension)style_get_max_height:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_max_height:(void * _Nonnull)style :(float)value :(CMasonDimensionType)value_type;
+ (CMasonLengthPercentageSize)style_get_gap:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_gap:(void * _Nonnull)style :(float)width_value :(CMasonLengthPercentageType)width_type :(float)height_value :(CMasonLengthPercentageType)height_type;
+ (CMasonLengthPercentage)style_get_row_gap:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_row_gap:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (CMasonLengthPercentage)style_get_column_gap:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_column_gap:(void * _Nonnull)style :(float)value :(CMasonLengthPercentageType)value_type;
+ (float)style_get_aspect_ratio:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_aspect_ratio:(void * _Nonnull)style :(float)value;
+ (CMasonMinMaxArray * _Nonnull)style_get_grid_auto_rows:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_auto_rows:(void * _Nonnull)style :(CMasonMinMaxArray * _Nonnull)value;
+ (CMasonMinMaxArray * _Nonnull)style_get_grid_auto_columns:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_auto_columns:(void * _Nonnull)style :(CMasonMinMaxArray * _Nonnull)value;
+ (int32_t)style_get_grid_auto_flow:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_auto_flow:(void * _Nonnull)style :(int32_t)value;
+ (CMasonGridPlacement)style_get_grid_column_start:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_column_start:(void * _Nonnull)style :(CMasonGridPlacement)value;
+ (CMasonGridPlacement)style_get_grid_column_end:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_column_end:(void * _Nonnull)style :(CMasonGridPlacement)value;
+ (CMasonGridPlacement)style_get_grid_row_start:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_row_start:(void * _Nonnull)style :(CMasonGridPlacement)value;
+ (CMasonGridPlacement)style_get_grid_row_end:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_row_end:(void * _Nonnull)style :(CMasonGridPlacement)value;
+ (CMasonTrackSizingFunctionArray * _Nonnull)style_get_grid_template_rows:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_template_rows:(void * _Nonnull)style :(CMasonTrackSizingFunctionArray * _Nonnull)value;
+ (CMasonTrackSizingFunctionArray * _Nonnull)style_get_grid_template_columns:(void * _Nonnull)style SWIFT_WARN_UNUSED_RESULT;
+ (void)style_set_grid_template_columns:(void * _Nonnull)style :(CMasonTrackSizingFunctionArray * _Nonnull)value;
+ (void)style_update_with_values:(void * _Nonnull)style :(int32_t)display :(int32_t)position :(int32_t)direction :(int32_t)flexDirection :(int32_t)flexWrap :(int32_t)overflow :(int32_t)alignItems :(int32_t)alignSelf :(int32_t)alignContent :(int32_t)justifyItems :(int32_t)justifySelf :(int32_t)justifyContent :(int32_t)insetLeftType :(float)insetLeftValue :(int32_t)insetRightType :(float)insetRightValue :(int32_t)insetTopType :(float)insetTopValue :(int32_t)insetBottomType :(float)insetBottomValue :(int32_t)marginLeftType :(float)marginLeftValue :(int32_t)marginRightType :(float)marginRightValue :(int32_t)marginTopType :(float)marginTopValue :(int32_t)marginBottomType :(float)marginBottomValue :(int32_t)paddingLeftType :(float)paddingLeftValue :(int32_t)paddingRightType :(float)paddingRightValue :(int32_t)paddingTopType :(float)paddingTopValue :(int32_t)paddingBottomType :(float)paddingBottomValue :(int32_t)borderLeftType :(float)borderLeftValue :(int32_t)borderRightType :(float)borderRightValue :(int32_t)borderTopType :(float)borderTopValue :(int32_t)borderBottomType :(float)borderBottomValue :(float)flexGrow :(float)flexShrink :(int32_t)flexBasisType :(float)flexBasisValue :(int32_t)widthType :(float)widthValue :(int32_t)heightType :(float)heightValue :(int32_t)minWidthType :(float)minWidthValue :(int32_t)minHeightType :(float)minHeightValue :(int32_t)maxWidthType :(float)maxWidthValue :(int32_t)maxHeightType :(float)maxHeightValue :(int32_t)gapRowType :(float)gapRowValue :(int32_t)gapColumnType :(float)gapColumnValue :(float)aspectRatio :(CMasonNonRepeatedTrackSizingFunctionArray * _Nonnull)gridAutoRows :(CMasonNonRepeatedTrackSizingFunctionArray * _Nonnull)gridAutoColumns :(int32_t)gridAutoFlow :(int32_t)gridColumnStartType :(int16_t)gridColumnStartValue :(int32_t)gridColumnEndType :(int16_t)gridColumnEndValue :(int32_t)gridRowStartType :(int16_t)gridRowStartValue :(int32_t)gridRowEndType :(int16_t)gridRowEndValue :(CMasonTrackSizingFunctionArray * _Nonnull)gridTemplateRows gridTemplateColumns:(CMasonTrackSizingFunctionArray * _Nonnull)gridTemplateColumns;
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end

enum Position : NSInteger;
enum Overflow : NSInteger;

SWIFT_CLASS_NAMED("MasonStyle")
@interface MasonStyle : NSObject
@property (nonatomic, readonly) void * _Null_unspecified nativePtr;
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic) enum Display display;
@property (nonatomic) enum Position position;
@property (nonatomic) enum Direction direction;
@property (nonatomic) enum FlexDirection flexDirection;
@property (nonatomic) enum FlexWrap flexWrap;
@property (nonatomic) enum Overflow overflow;
@property (nonatomic) enum AlignItems alignItems;
@property (nonatomic) enum AlignSelf alignSelf;
@property (nonatomic) enum AlignContent alignContent;
@property (nonatomic) enum JustifyItems justifyItems;
@property (nonatomic) enum JustifySelf justifySelf;
@property (nonatomic) enum JustifyContent justifyContent;
@property (nonatomic, strong) MasonLengthPercentageAutoRectCompat * _Nonnull insetCompat;
- (void)setInsetLeft:(float)value :(NSInteger)type;
- (void)setInsetRight:(float)value :(NSInteger)type;
- (void)setInsetTop:(float)value :(NSInteger)type;
- (void)setInsetBottom:(float)value :(NSInteger)type;
- (void)setInsetWithValueType:(float)value :(NSInteger)type;
@property (nonatomic, strong) MasonLengthPercentageAutoRectCompat * _Nonnull marginCompat;
- (void)setMarginLeft:(float)value :(NSInteger)type;
- (void)setMarginRight:(float)value :(NSInteger)type;
- (void)setMarginTop:(float)value :(NSInteger)type;
- (void)setMarginBottom:(float)value :(NSInteger)type;
- (void)setMarginWithValueType:(float)value :(NSInteger)type;
@property (nonatomic, strong) MasonLengthPercentageRectCompat * _Nonnull paddingCompat;
- (void)setPaddingLeft:(float)value :(NSInteger)type;
- (void)setPaddingRight:(float)value :(NSInteger)type;
- (void)setPaddingTop:(float)value :(NSInteger)type;
- (void)setPaddingBottom:(float)value :(NSInteger)type;
- (void)setPaddingWithValueType:(float)value :(NSInteger)type;
@property (nonatomic, strong) MasonLengthPercentageRectCompat * _Nonnull borderCompat;
- (void)setBorderLeft:(float)value :(NSInteger)type;
- (void)setBorderRight:(float)value :(NSInteger)type;
- (void)setBorderTop:(float)value :(NSInteger)type;
- (void)setBorderBottom:(float)value :(NSInteger)type;
- (void)setBorderWithValueType:(float)value :(NSInteger)type;
@property (nonatomic) float flexGrow;
@property (nonatomic) float flexShrink;
@property (nonatomic, strong) MasonDimensionSizeCompat * _Nonnull minSizeCompat;
- (void)setMinSizeWidth:(float)value :(NSInteger)type;
- (void)setMinSizeHeight:(float)value :(NSInteger)type;
- (void)setMinSizeWidthHeight:(float)value :(NSInteger)type;
@property (nonatomic, strong) MasonDimensionSizeCompat * _Nonnull sizeCompat;
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull sizeCompatWidth;
@property (nonatomic, strong) MasonDimensionCompat * _Nonnull sizeCompatHeight;
- (void)setSizeWidth:(float)value :(NSInteger)type;
- (void)setSizeHeight:(float)value :(NSInteger)type;
- (void)setSizeWidthHeight:(float)value :(NSInteger)type;
@property (nonatomic, strong) MasonDimensionSizeCompat * _Nonnull maxSizeCompat;
- (void)setMaxSizeWidth:(float)value :(NSInteger)type;
- (void)setMaxSizeHeight:(float)value :(NSInteger)type;
- (void)setMaxSizeWidthHeight:(float)value :(NSInteger)type;
@property (nonatomic, strong) MasonLengthPercentageSizeCompat * _Nonnull gapCompat;
- (void)setGapRow:(float)value :(NSInteger)type;
- (void)setGapColumn:(float)value :(NSInteger)type;
- (void)setRowGap:(float)value :(NSInteger)type;
- (void)setColumnGap:(float)value :(NSInteger)type;
@property (nonatomic) enum FlexGridAutoFlowWrap gridAutoFlow;
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
@end


SWIFT_CLASS_NAMED("MeasureOutput")
@interface MeasureOutput : NSObject
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end

typedef SWIFT_ENUM_NAMED(NSInteger, Overflow, "Overflow", open) {
  OverflowVisible = 0,
  OverflowHidden = 1,
  OverflowScroll = 2,
};

typedef SWIFT_ENUM_NAMED(NSInteger, Position, "Position", open) {
  PositionRelative = 0,
  PositionAbsolute = 1,
};


SWIFT_CLASS_NAMED("TSCMason")
@interface TSCMason : NSObject
@property (nonatomic, readonly) void * _Null_unspecified nativePtr;
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
- (void)clear;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) TSCMason * _Nonnull instance;)
+ (TSCMason * _Nonnull)instance SWIFT_WARN_UNUSED_RESULT;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) BOOL shared;)
+ (BOOL)shared SWIFT_WARN_UNUSED_RESULT;
+ (void)setShared:(BOOL)value;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class) BOOL alwaysEnable;)
+ (BOOL)alwaysEnable SWIFT_WARN_UNUSED_RESULT;
+ (void)setAlwaysEnable:(BOOL)value;
@end


@interface UIView (SWIFT_EXTENSION(Mason))
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly) NSInteger masonPtr;)
+ (NSInteger)masonPtr SWIFT_WARN_UNUSED_RESULT;
@property (nonatomic, readonly) NSInteger masonNodePtr;
@property (nonatomic, readonly) NSInteger masonStylePtr;
@property (nonatomic, readonly) BOOL isMasonEnabled;
@property (nonatomic, strong) MasonStyle * _Nonnull style;
- (void)addSubviews:(NSArray<UIView *> * _Nonnull)views;
- (void)addSubviews:(NSArray<UIView *> * _Nonnull)views at:(NSInteger)index;
- (void)setPadding:(float)left :(float)top :(float)right :(float)bottom;
- (void)setBorder:(float)left :(float)top :(float)right :(float)bottom;
- (void)setMargin:(float)left :(float)top :(float)right :(float)bottom;
- (void)setInset:(float)left :(float)top :(float)right :(float)bottom;
- (void)setMinSize:(float)width :(float)height;
- (void)setSize:(float)width :(float)height;
- (void)setMaxSize:(float)width :(float)height;
- (void)setGap:(float)width :(float)height;
@end

#endif
#if defined(__cplusplus)
#endif
#if __has_attribute(external_source_symbol)
# pragma clang attribute pop
#endif
#pragma clang diagnostic pop
#endif

#else
#error unsupported Swift architecture
#endif
