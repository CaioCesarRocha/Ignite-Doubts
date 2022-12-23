import Link, {LinkProps} from 'next/link'
import { useRouter } from 'next/router';
import styles from '.styles.module.scss'
import { ReactElement, cloneElement} from 'react'


interface ActiveLinkProps extends LinkProps{
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLinkProps){
    const { asPath} = useRouter();
    
    const className = asPath === rest.href // se o link ativo for = ao passando dentro rest.href
        ? activeClassName
        : '';

    return(
        <Link legacyBehavior {...rest}>
            {cloneElement(children,{ //o children por padrao não pode receber proprieda então usamos o recurso
                className,           //do cloneElement podendo passar o className (estilo do button selecionado)
            })}
        </Link>
    )
}