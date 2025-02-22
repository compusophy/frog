import type { HtmlEscapedString } from 'hono/utils/html'

export const buttonPrefix = {
  link: '_l',
  mint: '_m',
  redirect: '_r',
  reset: '_c',
  transaction: '_t',
}

export type ButtonProps = {
  children: string | string[]
}

export type ButtonRootProps = ButtonProps & {
  action?: string | undefined
  value?: string | undefined
}

ButtonRoot.__type = 'button'
export function ButtonRoot({
  action,
  children,
  // @ts-ignore - private
  index = 1,
  value,
}: ButtonRootProps) {
  return [
    <meta
      property={`fc:frame:button:${index}`}
      content={normalizeChildren(children)}
      {...(value ? { 'data-value': value } : {})}
    />,
    <meta property={`fc:frame:button:${index}:action`} content="post" />,
    action && (
      <meta property={`fc:frame:button:${index}:target`} content={action} />
    ),
  ] as unknown as HtmlEscapedString
}

export type ButtonLinkProps = ButtonProps & {
  href: string
}

ButtonLink.__type = 'button'
export function ButtonLink({
  children,
  // @ts-ignore - private
  index = 1,
  href,
}: ButtonLinkProps) {
  return [
    <meta
      property={`fc:frame:button:${index}`}
      content={normalizeChildren(children)}
      data-value={buttonPrefix.link}
    />,
    <meta property={`fc:frame:button:${index}:action`} content="link" />,
    <meta property={`fc:frame:button:${index}:target`} content={href} />,
  ] as unknown as HtmlEscapedString
}

export type ButtonMintProps = ButtonProps & {
  target: string
}

ButtonMint.__type = 'button'
export function ButtonMint({
  children,
  // @ts-ignore - private
  index = 1,
  target,
}: ButtonMintProps) {
  return [
    <meta
      property={`fc:frame:button:${index}`}
      content={normalizeChildren(children)}
      data-value={buttonPrefix.mint}
    />,
    <meta property={`fc:frame:button:${index}:action`} content="mint" />,
    <meta property={`fc:frame:button:${index}:target`} content={target} />,
  ] as unknown as HtmlEscapedString
}

export type ButtonRedirectProps = ButtonProps & {
  location: string
}

ButtonRedirect.__type = 'button'
export function ButtonRedirect({
  children,
  // @ts-ignore - private
  index = 1,
  location,
}: ButtonRedirectProps) {
  return [
    <meta
      property={`fc:frame:button:${index}`}
      content={normalizeChildren(children)}
      data-type="redirect"
      data-value={`${buttonPrefix.redirect}:${location}`}
    />,
    <meta
      property={`fc:frame:button:${index}:action`}
      content="post_redirect"
    />,
    // TODO: Add `target` prop so folks can `'post_redirect'` to a different frame
    // <meta property={`fc:frame:button:${index}:target`} content={target} />,
  ] as unknown as HtmlEscapedString
}

export type ButtonResetProps = ButtonProps

ButtonReset.__type = 'button'
export function ButtonReset({
  children,
  // @ts-ignore - private
  index = 1,
}: ButtonResetProps) {
  return (
    <meta
      property={`fc:frame:button:${index}`}
      content={normalizeChildren(children)}
      data-value={buttonPrefix.reset}
      data-type="reset"
    />
  )
}

export type ButtonTransactionProps = ButtonProps & {
  target: string
}

ButtonTransaction.__type = 'button'
export function ButtonTransaction({
  children,
  // @ts-ignore - private
  index = 1,
  target,
}: ButtonTransactionProps) {
  return [
    <meta
      property={`fc:frame:button:${index}`}
      content={normalizeChildren(children)}
      data-value={buttonPrefix.transaction}
    />,
    <meta property={`fc:frame:button:${index}:action`} content="tx" />,
    <meta property={`fc:frame:button:${index}:target`} content={target} />,
  ] as unknown as HtmlEscapedString
}

export const Button = Object.assign(ButtonRoot, {
  Link: ButtonLink,
  Mint: ButtonMint,
  Redirect: ButtonRedirect,
  Reset: ButtonReset,
  Transaction: ButtonTransaction,
})

function normalizeChildren(children: string | string[]) {
  return Array.isArray(children) ? children.join('') : children
}
