import style from './NotFound.module.css'

const NotFound = () => {
    return (
        <div className={style['notFound-container']}>
            <h1 className={style['notFound-title']}>404 - Page Not Found</h1>
            <p className={style['notFound-message']}>The page you are looking for does not exist.</p>
        </div>
    )
}
export default NotFound;