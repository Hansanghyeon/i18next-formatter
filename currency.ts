i18n.services.formatter?.add('currency', (value, lng, options) => {
  // 기본값을 currency로 설정한다.
  if (!options?.style) {
    options.style = 'currency'
  }
  if (options?.removeCountry && options?.currencyDisplay === 'name') {
    const getCurrencyName = new Intl.NumberFormat(lng, options).format(value)
    const result = getCurrencyName.split(' ')

    // 기본 template
    const template = options?.template || '[[currency]]'
    return pipe(template, S.replace('[[currency]]', result.slice(-1)[0]))
  }
  return new Intl.NumberFormat(lng, options).format(value)
})

/**
 * next-i18next에서는 해당 formatter를 추가하는 방식이 재대로 동작하지는 않고있다.
 * TODO: 오류 수정해야함. 지금 당장 해결하기에는 중요도가 낮아서 다음에 진행하는 것으로
 * 시도해본방법.
 * next - i18next.config.js 파일에서 서드파티 플러그인으로 포맷터를 추가하는 방법 사용 -> 실패
 * https://github.com/i18next/next-i18next/issues/1535
 */
// i18n에 currency 포맷터를 덮어씌운다.
// 기존 기능은 모두 가져오고 원하는 기능만 덮어씌운다.
interface CustomOptions extends Intl.NumberFormatOptions {
  removeCountry?: boolean
}
i18n.services.formatter?.add('price', (value, lng, options) => {
  const overrideOptions = { ...options }
  // 기본값을 currency로 설정한다.
  if (!overrideOptions?.style) {
    overrideOptions.style = 'currency'
  }

  // 대한민국 통화 커스텀 포맷터
  // Javascript의 기본 Intl.NumberFormat에서 name의 값은 `대한민국 원`으로만 지원한다.
  // 하지만우리는 `1,000 원`을 원한다.
  // 모든 나라 화폐에 대해서 동일하게 화페 단위만 가져올 것이다.
  // - 대한민국 원
  // - 미국 달러
  // - 유로
  // - 일본 엔화
  if (
    overrideOptions?.removeCountry &&
    overrideOptions?.currencyDisplay === 'name'
  ) {
    const getCurrencyName = new Intl.NumberFormat(
      lng,
      overrideOptions
    ).format(value)
    const result = getCurrencyName.split(' ')
    // 가격제거
    const price = result.shift()

    // 기본 template
    const template = overrideOptions?.template || '[[amount]] [[currency]]'
    return pipe(
      template,
      S.replace('[[amount]]', String(price)),
      S.replace('[[currency]]', result.slice(-1)[0])
    )
  }
  return new Intl.NumberFormat(lng, overrideOptions).format(value)
})
