<?php

//l18n
add_action('after_setup_theme', 'pi_l18n');
function pi_l18n(){
    load_theme_textdomain( 'quan', get_template_directory() . '/languages' );
}

function dumpit( $var, $dump = 'export', $return = false ) {
	$text = '<code><pre>';
	switch( $dump ) {
		case 'export' : 
			$text .= var_export( $var, true );
			break;
		case 'html' : 
			$text .= htmlentities( var_export( $var, true ) );
			break;
	}
	$text .= '</pre></code>';
	if ( $return ) {
		return $text;
	} else {
		echo $text;
	}
}

// Remove empty paragraph tags
function removeEmptyParagraphs( $content ) {
    $content = str_replace("<p></p>","",$content);
    return $content;
}
add_filter( 'the_content', 'removeEmptyParagraphs', 9999 );
remove_filter('the_excerpt', 'wpautop'); 

// Disable WordPress version reporting as a basic protection against attacks
function remove_generators() {
	return '';
}		

add_filter('the_generator','remove_generators');

add_filter('the_generator', create_function('', 'return "";'));
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');

// remove wp version param from any enqueued scripts
function vc_remove_wp_ver_css_js( $src ) {
    if ( strpos( $src, 'ver=' ) )
        $src = remove_query_arg( 'ver', $src );
    return $src;
}
add_filter( 'style_loader_src', 'vc_remove_wp_ver_css_js', 9999 );
add_filter( 'script_loader_src', 'vc_remove_wp_ver_css_js', 9999 );

/**
	ENQUEUE SCRIPTS
******/
add_action( 'wp_enqueue_scripts', 'quan_add_scripts' );

function quan_add_scripts() {
	wp_register_script( 'modernizr', get_template_directory_uri() .  '/js/custom.modernizr.js', false, '', false );
	wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', 'http://code.jquery.com/jquery-latest.min.js' );
    wp_register_script( 'scrollspy', get_template_directory_uri() .  '/js/scrollspy.js', array( 'jquery' ), '', true );
    wp_register_script( 'quan_scrollspy', get_template_directory_uri() .  '/js/quan-scrollspy.js', array( 'jquery', 'scrollspy', 'livequery' ), '', true );
    wp_register_script( 'livequery', get_template_directory_uri() .  '/js/livequery.js', array( 'jquery' ), '', true );
    wp_register_script( 'smartresize', get_template_directory_uri() .  '/js/smartresize.js', array( 'jquery' ), '0.1', true );
    wp_register_script( 'smoothscroll', get_template_directory_uri() .  '/js/smoothscroll.js', array( 'jquery' ), '', true );
    wp_register_script( 'app', get_template_directory_uri() .  '/js/app.js', array( 'jquery', 'smartresize' ), '', true );
    wp_register_script( 'ajaxposts', get_template_directory_uri() .  '/js/ajaxposts.js', array( 'jquery' ), '', true );

    //styles
    wp_enqueue_style( 'normalize', get_template_directory_uri() . '/css/normalize.css' );
    wp_enqueue_style( 'app', get_template_directory_uri() . '/css/app.css', 'normalize' );
    
	wp_enqueue_script( array(
		'jquery',
		'modernizr',
		'smartresize',
		'smoothscroll',
		'normalize',
		'app'
	) );

	if( is_single() ) {
		wp_enqueue_script( array(
			'scrollspy',
			'livequery',
			'quan_scrollspy',
			)
		);
	}

	if( is_home() ) {
		wp_enqueue_script( array(
			'ajaxposts'
			)
		);	
	}

	//pass post ids to jquery
	// wp_localize_script( 'ajaxposts', 'ajaxpost_localization', array(
	// 	'post_ids' => $ids
	// ) );
}
	
// always define ajaxurl
add_action('wp_head','pi_ajaxurl');

function pi_ajaxurl() {
?>
	<script type="text/javascript">
		var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
	</script>
<?php
}

add_action('admin_menu','wphidenag');

function wphidenag() {
	remove_action( 'admin_notices', 'update_nag', 3 );
}

/**
 * Inserts an array of strings into a file (.htaccess ), placing it between
 * BEGIN and END markers. Replaces existing marked info. Retains surrounding
 * data. Creates file if none exists.
 *
 * @param array|string $insertion
 * @return bool True on write success, false on failure.
 */

add_action( 'admin_init', 'add_htaccess' );

function add_htaccess($insertion) {
    $htaccess_file = ABSPATH.'.htaccess';
    $insertion = array(
    	'AddType application/vnd.ms-fontobject .eot',
		'AddType font/ttf .ttf',
		'AddType font/otf .otf',
		'AddType application/font-woff .woff',
		'AddType application/x-font-woff .woff'
    	);
    return insert_with_markers($htaccess_file, 'Font-MIME-Type', $insertion);
}

//register header menu
add_action( 'init', 'quan_header_menu' );

function quan_header_menu() {
	register_nav_menus( 
		array(
			'header-menu' => 'Header Menu',
			'footer-menu' => 'Footer Menu'
		)
	);
}

function quan_comments_display($comment, $args, $depth) {
		$GLOBALS['comment'] = $comment;
		extract($args, EXTR_SKIP);

		if ( 'div' == $args['style'] ) {
			$tag = 'div';
			$add_below = 'comment';
		} else {
			$tag = 'li';
			$add_below = 'div-comment';
		}
	?>
		<<?php echo $tag ?> <?php comment_class(empty( $args['has_children'] ) ? '' : 'parent') ?> id="comment-<?php comment_ID() ?>">
		<?php if ( 'div' != $args['style'] ) : ?>
			<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
		<?php endif; ?>
		
		<div class="comment-author vcard">
			<?php if ($args['avatar_size'] != 0) echo get_avatar( $comment, $args['avatar_size'] ); ?>
			<?php $build_link = '<a href="' . $comment->comment_author_url . '" rel="nofollow external" class="url" target="_blank">' . $comment->comment_author . '</a>'; ?>
			<?php printf(__('<span class="fn">%s'), $build_link ) ?>
				 <span class="comment-meta commentmetadata"><a href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ) ?>">
					<?php
						/* translators: 1: date, 2: time */
						printf( __('%1$s at %2$s'), get_comment_date(),  get_comment_time()) ?></a><?php edit_comment_link(__('(Edit)'),'  ','' );
					?>
				</span>
			</span>
		</div>
	<?php if ($comment->comment_approved == '0') : ?>
		<em class="comment-awaiting-moderation"><?php _e('Your comment is awaiting moderation.') ?></em>
		<br />
	<?php endif; ?>

	<?php comment_text() ?>

	<div class="reply">
		<?php comment_reply_link(array_merge( $args, array('add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth']))) ?>
	</div>
		<?php if ( 'div' != $args['style'] ) : ?>
		</div>
		<?php endif; ?>
<?php
        }

add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form' ) );

add_theme_support( 'post-thumbnails' );

add_image_size( 'small', 480, 270, true );
add_image_size( 'medium', 960, 540, true );
add_image_size( 'large', 1920, 1080, true );
add_image_size( 'xlarge', 3840, 2160, true );



add_action('wp_footer', 'show_template');
function show_template( $return = false ) {
    global $template;
    switch ( $return ) {
    	case false:
    		print_r( $template );
    		break;
    	case true :
    		return( $template );
    		break;
    }
}


add_action( 'wp_ajax_nopriv_quan_query_posts', 'quan_load_posts' );
add_action( 'wp_ajax_quan_query_posts', 'quan_load_posts' );

function quan_load_posts() {
$query_strings = $_POST[ 'query_strings' ];
$cat_id = $query_strings['id'];
$cat_id = str_replace( 'cat-', '', $cat_id );
// dumpit( $_POST );

	$ajax_query = new WP_Query( array(
		'post_type' => 'post',
		'posts_per_page' => -1,
		'order'          => 'DESC',
		'orderby'        => 'date',
		'cat' => $cat_id
		)
	);

	$ajax_ids = array();

	if( $ajax_query->have_posts() ) :
		while( $ajax_query->have_posts() ) :
			$ajax_query->the_post();

			$ajax_ids[] = get_the_id();

		endwhile;
	endif;
	
	echo json_encode( $ajax_ids );	
	die();

}